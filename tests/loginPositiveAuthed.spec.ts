import test, { expect } from "@playwright/test"
import LoginPage from "../pages/loginPage"

test('Check am I Logged in via saved auth state test @Login @Regression', async ({ page }) => {

await page.goto('https://ovcharski.com/shop/login/')
await expect(page.getByRole('link', { name: 'Automation User' })).toBeVisible();
await expect(page.getByText('Automation User')).toBeVisible;
await expect(page.getByRole('link', { name: 'Your account' })).toBeVisible();

await page.close();

})



