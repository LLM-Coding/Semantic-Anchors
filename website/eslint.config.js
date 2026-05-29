import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
  navigator: 'readonly',
  fetch: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  history: 'readonly',
  location: 'readonly',
  localStorage: 'readonly',
  sessionStorage: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  HTMLElement: 'readonly',
  DOMParser: 'readonly',
  Event: 'readonly',
  CustomEvent: 'readonly',
  KeyboardEvent: 'readonly',
  HashChangeEvent: 'readonly',
  PopStateEvent: 'readonly',
  MutationObserver: 'readonly',
  IntersectionObserver: 'readonly',
  requestAnimationFrame: 'readonly',
  performance: 'readonly',
  Blob: 'readonly',
}

export default [
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      '.lighthouseci/**',
      'test-results/**',
    ],
  },
  {
    files: ['**/*.test.js', 'tests/**/*.js', 'playwright.config.js'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        global: 'writable',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
]
