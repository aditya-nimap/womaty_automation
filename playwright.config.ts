import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.dev') });

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : 4, // Increased local workers
    reporter: [
        ['html', { outputFolder: 'reports/html' }],
        ['junit', { outputFile: 'reports/junit/results.xml' }],
        ['list'],
        process.env.CI ? ['github'] : ['list'],
    ],
    globalSetup: require.resolve('./config/global-setup'),
    globalTeardown: require.resolve('./config/global-teardown'),

    use: {
        baseURL: process.env.BASE_URL || 'https://dev.womaty.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on', // Record video for all tests
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        headless: false, // Run in headful mode
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],
});
