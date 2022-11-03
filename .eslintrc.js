/**
 * @type {import('@types/eslint').Linter.Config}
 */
module.exports = {
  'extends': [
    '@antfu'
  ],
  "rules": {
    "curly": [2, "all"],
    "@typescript-eslint/brace-style": [2, "1tbs"]
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
};
