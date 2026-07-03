// Adapted for ESLint 10: eslint-config-next@16's base config registers Next's
// bundled babel-eslint-parser whose scope manager is missing the
// `scopeManager.addGlobals` API that ESLint 10 requires. We register
// @next/eslint-plugin-next directly and rely on typescript-eslint's parser.
// See: https://github.com/vercel/next.js/issues (track upstream fix)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    plugins: { "jsx-a11y": jsxA11y },
    rules: jsxA11y.configs.recommended.rules,
  },
  {
    // scripts/contrast-audit.mjs is a standalone Node CLI (not part of the
    // app bundle) that also embeds a function shipped as a *string* and
    // executed inside headless Chrome via CDP Runtime.evaluate — so the
    // file legitimately references both Node globals and browser globals
    // that never actually run in this Node process.
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        fetch: "readonly",
        WebSocket: "readonly",
        document: "readonly",
        window: "readonly",
        getComputedStyle: "readonly",
      },
    },
  },
  // Must come last — disables ESLint rules that conflict with Prettier formatting
  prettierConfig,
  {
    ignores: [".next/**", "node_modules/**", "public/**", "next-env.d.ts"],
  },
];
