import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 ships native flat configs, so they are spread in
 * directly. Routing them through FlatCompat (`compat.extends(...)`) crashes
 * ESLint with "Converting circular structure to JSON", because FlatCompat
 * expects eslintrc-style config objects, not flat ones.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ["src/generated/**"],
  },
];

export default eslintConfig;
