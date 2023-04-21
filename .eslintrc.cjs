/**
 * @type {import('@types/eslint').Linter.Config}
 */
module.exports = {
  extends: [
    '@antfu/eslint-config-basic',
    '@antfu/eslint-config-ts',
    'plugin:astro/recommended',
  ],
  rules: {
    'curly': [2, 'all'],
    'spaced-comment': ['error', 'always', {
      line: {
        markers: ['#region', '#endregion', 'region', 'endregion', '/'],
      },
    }],
    '@typescript-eslint/brace-style': [
      2,
      '1tbs',
    ],
    '@typescript-eslint/ban-ts-comment': 0,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'pnpm-lock.yaml',
    '.eslintrc.js',
    'package.json',
    '.vscode',
    '*.config.js',
    'tsconfig.json',
  ],
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
}
