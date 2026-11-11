import { Browser, chromium, expect, Page } from '@playwright/test';
import LoginPage from './pages/LoginPage';
import config from './playwright.config';
import { testUser } from './helpers/test-user';

async function globalSetup() {
    const { username, password } = testUser;

    if (!username || !password) {
        throw new Error('TEST_USERNAME and TEST_PASSWORD must be set in .env file');
    }

    let browser: Browser | null = null;
    try {
        const baseURL = config.use?.baseURL || 'https://ovcharski.com/shop/';
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ baseURL });
        const page: Page = await context.newPage();
        const login = new LoginPage(page);

        await page.goto('login/');
        await login.login(username, password);

        await expect(page).toHaveTitle('User – Automation Demo Site');
        await expect(page).toHaveURL(testUser.profilePath);

        // Save the state of the web page
        await page.context().storageState({ path: './LoginAuth.json' });
    } catch (error) {
        console.error('Error during global setup:', error);
        // Rethrow so a failed login aborts the run — otherwise every test
        // proceeds with missing/stale auth state and fails confusingly.
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export default globalSetup;
