import test, { expect } from "@playwright/test";
import LoginPage from "../pages/loginPage";

test.use({ storageState: "./NoAuth.json" });
test('Login test @Login @Regression', async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto('https://ovcharski.com/shop/login/');
    await login.login('playwrightuser', 'playwrightuser'); // Use the login method

    // Validate the login process
    await expect(page).toHaveTitle('User – Automation Demo Site');
    await expect(page).toHaveURL('https://ovcharski.com/shop/user/playwrightuser/');
    await expect(page.getByRole('heading', { name: 'Automation User' })).toHaveText('Automation User');

    // Validate cover photo
    await expect(page.getByRole('img', { name: 'playwrightuser' })).toBeVisible();
    await expect(page.getByAltText('Automation User')).toBeVisible();

    await page.close();
});