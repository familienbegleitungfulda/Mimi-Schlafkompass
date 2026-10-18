import { randomBytes } from "node:crypto";
import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { products } from "../../src/data/products";
import { isPossibleSleepAssociation } from "../../src/engine/associationEngine";
import { buildProductReasons, selectPublicProductId } from "../../src/engine/productSelection";
import {
  checkRateLimit,
  errorResponse,
  getOpenAIKey,
  jsonResponse,
  validateMessages,
} from "../lib/guards";
import { generateReport, type ReportProduct } from "../lib/report";
import { buildReportPdf } from "../lib/reportPdf";
import {
  ensureAttributes,
  getBrevoConfig,
  isContactInList,
  missingBrevoEnv,
  sendDoubleOptIn,
  updateAndSendReport,
  type BrevoAttributes,
} from "../lib/brevo";

const SUBSCRIBE_REQUESTS_PER_HOUR = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const REPORT_STORE = "auswertungen";

const MAX_PROFILE_FIELDS = 40;
const MAX_PROFILE_VALUE = 400;

/** Schlafprofil aus dem Chat – nur kurze Textfelder werden übernommen. */
function sanitizeProfile(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const profile: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw).slice(0, MAX_PROFILE_FIELDS)) {
    if (/^[A-Za-z]{1,40}$/.test(key) && typeof value === "string" && value.trim()) {
      profile[key] = value.trim().slice(0, MAX_PROFILE_VALUE);
    }
  }
  return profile;
}

function resolveProduct(productId: unknown, profile: Record<string, string>): ReportProduct {
  const product =
    products.find((p) => p.id === productId) ??
    products.find((p) => p.id === selectPublicProductId(profile))!;
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    url: product.url,
    reasons: buildProductReasons(product.id, profile),
  };
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Ungültige Anfrage.", 400);
  }

  // Honeypot field – real parents never fill it.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return jsonResponse({ ok: true, status: "doi" });
  }

  const vorname = typeof body.vorname === "string" ? body.vorname.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const age = typeof body.age === "string" ? body.age.trim().slice(0, 60) : "";

  if (!vorname || vorname.length > 60) {
    return errorResponse("Bitte gib deinen Vornamen an.", 400);
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return errorResponse("Bitte gib eine gültige E-Mail-Adresse an.", 400);
  }
  if (body.consent !== true) {
    return errorResponse("Bitte bestätige die Einwilligung.", 400);
  }

  const validated = validateMessages(body.messages, false);
  if ("error" in validated) {
    return errorResponse(validated.error, 400);
  }

  const brevoConfig = getBrevoConfig();
  if (!brevoConfig || !getOpenAIKey()) {
    const missing = missingBrevoEnv();
    if (!getOpenAIKey()) missing.push("OPENAI_API_KEY");
    console.error(
      `subscribe: missing or empty environment variables: ${missing.join(", ") || "Brevo-Werte ungültig (keine Zahl?)"}`
    );
    return errorResponse("Server ist nicht vollständig konfiguriert.", 500);
  }

  if (!(await checkRateLimit("subscribe", context.ip, SUBSCRIBE_REQUESTS_PER_HOUR))) {
    return errorResponse(
      "Zu viele Anfragen in kurzer Zeit. Bitte versuch es später noch einmal.",
      429
    );
  }

  try {
    const profile = sanitizeProfile(body.profile);
    if (!profile.age && age) profile.age = age;
    const product = resolveProduct(body.productId, profile);
    const report = await generateReport(validated.messages, product, age, {
      sleepAssociation:
        Object.keys(profile).length > 1
          ? isPossibleSleepAssociation(profile)
          : body.sleepAssociation === true,
    });
    const pdf = buildReportPdf({ vorname, report, product });

    // Random, unguessable file name (192 bit).
    const id = randomBytes(24).toString("base64url");
    await getStore(REPORT_STORE).set(id, pdf.buffer as ArrayBuffer, {
      metadata: { createdAt: new Date().toISOString(), product: product.id },
    });

    const origin =
      context.deploy?.context === "production" && context.site?.url
        ? context.site.url
        : new URL(req.url).origin;
    const pdfUrl = `${origin}/.netlify/functions/pdf?id=${id}`;

    const attributes: BrevoAttributes = {
      VORNAME: vorname,
      KIND_ALTER: report.kindAlter || age,
      SCHWERPUNKT: report.schwerpunkt,
      EMPFEHLUNG: product.title,
      AUSWERTUNG_LINK: pdfUrl,
    };

    await ensureAttributes(brevoConfig);

    const alreadySubscribed = await isContactInList(brevoConfig, email);
    if (alreadySubscribed) {
      await updateAndSendReport(brevoConfig, email, attributes);
    } else {
      await sendDoubleOptIn(brevoConfig, email, attributes);
    }

    return jsonResponse({
      ok: true,
      status: alreadySubscribed ? "sent" : "doi",
    });
  } catch (error) {
    console.error("subscribe failed", error);
    return errorResponse("Das hat leider nicht geklappt.", 502);
  }
};
