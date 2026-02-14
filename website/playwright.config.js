import { defineConfig, devices } from '@playwright/test'

const LOCAL_BASE_URL = 'http://127.0.0.1:4173'
const baseURL = process.env.PLAYWRIGHT_BASE_URL || LOCAL_BASE_URL
const useLocalWebServer = !process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: useLocalWebServer ? {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
    url: LOCAL_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  } : undefined,

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
