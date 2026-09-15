import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": [
        "warn",
        {
          allowInFiles: ["src/lib/data-store.ts", "src/lib/auth.ts"],
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/unbound-method": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": "warn",
    },
  },
  // Ignore les fichiers de data pour les require (ils chargent des modules TS via require)
  {
    files: ["src/lib/data-store.ts", "src/lib/auth.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  { ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"] },
]);

export default eslintConfig;
