import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Next's own presets (core-web-vitals + typescript) rather than a hand-rolled
 * rule set — this project has no house style that diverges from Next's
 * defaults, so there's nothing to gain from maintaining a bespoke config.
 *
 * `precision-fc-next/` (a stale duplicate folder, see the note in
 * tsconfig.json) and generated output are excluded the same way tsconfig
 * already excludes them from the TypeScript program.
 */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["precision-fc-next/**", ".next/**", "node_modules/**"],
  },
];

export default eslintConfig;
