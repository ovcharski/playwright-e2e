import { Browser, chromium, expect, Page } from '@playwright/test';
import LoginPage from './pages/LoginPage';
import config from './playwright.config';

async function globalSetup() {
    let browser: Browser | null = null;
    try {
        const baseURL = config.use?.baseURL || 'https://ovcharski.com/shop/';
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ baseURL });
        const page: Page = await context.newPage();
        const login = new LoginPage(page);

        await page.goto('login/');
        await login.login('playwrightuser', 'playwrightuser');

        await expect(page).toHaveTitle('User – Automation Demo Site');
        await expect(page).toHaveURL('user/playwrightuser/');

        // Save the state of the web page
        await page.context().storageState({ path: './LoginAuth.json' });
    } catch (error) {
        console.error('Error during global setup:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export default globalSetup;
