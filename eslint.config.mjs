import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const boundary = (message) => [
  "error",
  { patterns: [{ group: ["@/features/*", "@/app/*"], message }] },
];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Features are independent: pages and layouts compose them.
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": boundary(
        "Features must not import other features or routes. Compose them in a page or layout.",
      ),
    },
  },
  {
    // Shared code sits below features.
    files: ["src/components/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}", "src/config/**/*.ts"],
    rules: {
      "no-restricted-imports": boundary("Shared code must not depend on features or routes."),
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);
