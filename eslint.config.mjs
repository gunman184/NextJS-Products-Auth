import { defineConfig } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import reactCompiler from "eslint-plugin-react-compiler";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  {
    // Apply this config to all your TS/JS files
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
      "react-compiler": reactCompiler,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...tsPlugin.configs.recommended.rules,
      "react-compiler/react-compiler": "error",
    },
  },
  {
    ignores: [".next/*", "node_modules/*", "dist/*"],
  },
]);
