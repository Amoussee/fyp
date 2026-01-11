import prettier from "eslint-config-prettier";

export default [
    prettier,
    {
        files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
        ignores: ["node_modules/**"],
        languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        },
        rules: {
        "no-unused-vars": "warn",
        "no-undef": "error",
        },
    },
];
