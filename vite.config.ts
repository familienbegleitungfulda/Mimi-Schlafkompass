import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Netlify sets URL / DEPLOY_PRIME_URL during each site's build.
 * This bakes the correct mode into the bundle per deployment target.
 */
function inferMimiModeFromDeployTarget(): string {
  const deployUrl = (
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    process.env.DEPLOY_URL ??
    ""
  ).toLowerCase();

  if (deployUrl.includes("schlummerwerkstatt")) {
    return "course";
  }

  if (deployUrl.includes("schlafkompass")) {
    return "public";
  }

  return "";
}

// https://vite.dev/config/
export default defineConfig(() => {
  const inferredMode = inferMimiModeFromDeployTarget();
  const explicitMode = process.env.VITE_MIMI_MODE ?? "";
  // Deploy URL wins over generic env (same repo may serve multiple Netlify sites)
  const mimiMode = inferredMode || explicitMode;

  return {
    plugins: [react()],
    define: mimiMode
      ? {
          "import.meta.env.VITE_MIMI_MODE": JSON.stringify(mimiMode),
        }
      : {},
  };
});
