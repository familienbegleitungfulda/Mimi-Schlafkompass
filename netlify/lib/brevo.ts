import { getStore } from "@netlify/blobs";
import { redactSecrets } from "./guards";

const BREVO_API = "https://api.brevo.com/v3";

/** Custom text attributes this app writes. VORNAME already exists in Brevo. */
const REQUIRED_TEXT_ATTRIBUTES = [
  "KIND_ALTER",
  "SCHWERPUNKT",
  "EMPFEHLUNG",
  "AUSWERTUNG_LINK",
];

const SETUP_FLAG_KEY = "brevo-attributes-v1";

let attributesReady = false;

export type BrevoAttributes = {
  VORNAME: string;
  KIND_ALTER: string;
  SCHWERPUNKT: string;
  EMPFEHLUNG: string;
  AUSWERTUNG_LINK: string;
};

export type BrevoConfig = {
  apiKey: string;
  listId: number;
  doiTemplateId: number;
  mailTemplateId: number;
  redirectUrl: string;
};

const BREVO_ENV_NAMES = [
  "BREVO_API_KEY",
  "BREVO_LIST_ID",
  "BREVO_DOI_TEMPLATE_ID",
  "BREVO_MAIL_TEMPLATE_ID",
  "BREVO_REDIRECT_URL",
];

/** Names (never values) of Brevo variables that are missing or empty. */
export function missingBrevoEnv(): string[] {
  return BREVO_ENV_NAMES.filter((name) => !(process.env[name] ?? "").trim());
}

export function getBrevoConfig(): BrevoConfig | null {
  const apiKey = (process.env.BREVO_API_KEY ?? "").trim();
  const listId = Number(process.env.BREVO_LIST_ID);
  const doiTemplateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const mailTemplateId = Number(process.env.BREVO_MAIL_TEMPLATE_ID);
  const redirectUrl = process.env.BREVO_REDIRECT_URL ?? "";

  if (!apiKey || !listId || !doiTemplateId || !mailTemplateId || !redirectUrl) {
    return null;
  }

  return { apiKey, listId, doiTemplateId, mailTemplateId, redirectUrl };
}

async function brevo(
  config: BrevoConfig,
  method: string,
  path: string,
  body?: unknown
): Promise<Response> {
  return fetch(`${BREVO_API}${path}`, {
    method,
    headers: {
      "api-key": config.apiKey,
      accept: "application/json",
      ...(body !== undefined ? { "content-type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function expectOk(response: Response, action: string): Promise<void> {
  if (!response.ok) {
    throw new Error(`Brevo ${action} failed (${response.status}): ${redactSecrets(await response.text())}`);
  }
}

/** a) Make sure the custom attributes exist – checked once, then remembered. */
export async function ensureAttributes(config: BrevoConfig): Promise<void> {
  if (attributesReady) return;

  const setupStore = getStore("mimi-setup");
  if (await setupStore.get(SETUP_FLAG_KEY)) {
    attributesReady = true;
    return;
  }

  const response = await brevo(config, "GET", "/contacts/attributes");
  await expectOk(response, "list attributes");
  const data = (await response.json()) as { attributes?: { name: string }[] };
  const existing = new Set((data.attributes ?? []).map((a) => a.name.toUpperCase()));

  for (const name of REQUIRED_TEXT_ATTRIBUTES) {
    if (existing.has(name)) continue;

    const created = await brevo(config, "POST", `/contacts/attributes/normal/${name}`, {
      type: "text",
    });
    // 400 "already exists" can happen if two requests race – that's fine.
    if (!created.ok && created.status !== 400) {
      await expectOk(created, `create attribute ${name}`);
    }
  }

  await setupStore.set(SETUP_FLAG_KEY, new Date().toISOString());
  attributesReady = true;
}

/** b) Is this email already a contact in our list? */
export async function isContactInList(
  config: BrevoConfig,
  email: string
): Promise<boolean> {
  const response = await brevo(
    config,
    "GET",
    `/contacts/${encodeURIComponent(email)}?identifierType=email_id`
  );

  if (response.status === 404) return false;
  await expectOk(response, "get contact");

  const contact = (await response.json()) as { listIds?: number[] };
  return (contact.listIds ?? []).includes(config.listId);
}

/** c) New contact: double opt-in with all attributes stored on confirmation. */
export async function sendDoubleOptIn(
  config: BrevoConfig,
  email: string,
  attributes: BrevoAttributes
): Promise<void> {
  const response = await brevo(config, "POST", "/contacts/doubleOptinConfirmation", {
    email,
    attributes,
    includeListIds: [config.listId],
    templateId: config.doiTemplateId,
    redirectionUrl: config.redirectUrl,
  });
  await expectOk(response, "double opt-in");
}

/** d) Existing contact: update attributes and send the report mail directly. */
export async function updateAndSendReport(
  config: BrevoConfig,
  email: string,
  attributes: BrevoAttributes
): Promise<void> {
  const update = await brevo(
    config,
    "PUT",
    `/contacts/${encodeURIComponent(email)}?identifierType=email_id`,
    { attributes }
  );
  await expectOk(update, "update contact");

  const mail = await brevo(config, "POST", "/smtp/email", {
    to: [{ email, name: attributes.VORNAME }],
    templateId: config.mailTemplateId,
    params: attributes,
  });
  await expectOk(mail, "send report mail");
}
