import test, { expect } from "@playwright/test"
import LoginPage from "../pages/loginPage"

test('Login test with wrong username and password @Login @Regression', async ({ page }) => {

const login = new LoginPage(page);
await page.goto('https://ovcharski.com/shop/login/')
await login.enterUsername('playwrightuser99');
await login.enterPassword('playwrightuser88');
await login.clickLoginBtn();

await expect(page).toHaveTitle('Login – Automation Demo Site');
await expect(page).toHaveURL('https://ovcharski.com/shop/login/');

// The next line no longer works. Changing the locator from p:has-text to getByText
// await expect(page.locator('p:has-text("Password is incorrect. Please try again.")')).toHaveText('Password is incorrect. Please try again.')

// new line to fix the issue:

await expect(page.getByText("Password is incorrect. Please try again.")).toHaveText('Password is incorrect. Please try again.')

await page.close();

})



