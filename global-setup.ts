import { Browser, chromium, expect, Page } from "@playwright/test";
import LoginPage from "./pages/loginPage";

async function globalSetup() {
    let browser: Browser | null = null;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page: Page = await context.newPage();
        const login = new LoginPage(page);

        await page.goto('https://ovcharski.com/shop/login/');
        await login.enterUsername('playwrightuser');
        await login.enterPassword('playwrightuser');
        await login.clickLoginBtn();

        await expect(page).toHaveTitle('User – Automation Demo Site');
        await expect(page).toHaveURL('https://ovcharski.com/shop/user/playwrightuser/');

        // Save the state of the web page
        await page.context().storageState({ path: "./LoginAuth.json" });
    } catch (error) {
        console.error('Error during global setup:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export default globalSetup;