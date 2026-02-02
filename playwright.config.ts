import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
    globalSetup: './global-setup',
    testDir: './tests',
    timeout: process.env.CI ? 30000 : 10000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 2,
    workers: process.env.CI ? 10 : 5,
    reporter: [
      ['list'],
      ['@testdino/playwright', { 
        serverUrl: "https://malamute-noble-miserably.ngrok-free.app",
        token: "trx_development_bbfbcff0ec0c5b835f37c2434345fcf9ed9d29d925eab61a3633787931747a1b",
        debug: true
      }]
    ],
    outputDir: 'test-results',
    use: {
        actionTimeout: 0,
        baseURL: 'https://ovcharski.com/shop/',
        trace: 'on-first-retry',
        storageState: './LoginAuth.json',
        headless: true,
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },

        {
          name: 'firefox',
          use: {
            ...devices['Desktop Firefox'],
          },
        },

        {
          name: 'webkit',
          use: {
            ...devices['Desktop Safari'],
          },
        }
    ]
};

export default config;
