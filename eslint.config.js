import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginCypress from 'eslint-plugin-cypress'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-duplicate-imports": "error",
      "no-self-compare": "error",
      "no-console": ["error", { allow: ["warn", "error" ] }],
      "no-else-return": "error",
      "no-empty-function": "error",
      "no-unassigned-vars": "error",
      "no-var": "error",
      "no-script-url": "error",
      "no-eval": "error",
      "no-alert": "error",
      "func-names": "error",
      "init-declarations": "error",
      "no-implied-eval": "error",
      "no-loop-func": "error",
      "no-multi-assign": "error",
      "prefer-const": "error",
      "semi": "error",
    },
  },
  {
    files: ['cypress/**/*.cy.ts'],
    extends: [pluginCypress.configs.recommended],
  }
)
