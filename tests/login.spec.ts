import test, { expect } from "@playwright/test"
import LoginPage from "../pages/loginPage"

// const username = 'playwrightuser'
// const password = 'playwrightuser'

test('Login test @Login @Regression', async ({ page }) => {



const login = new LoginPage(page);
await page.goto('https://ovcharski.com/shop/login/')
await login.enterUsername('playwrightuser');
await login.enterPassword('playwrightuser');
await login.clickLoginBtn();

await expect(page).toHaveTitle('User – Automation Demo Site');
await expect(page).toHaveURL('https://ovcharski.com/shop/user/playwrightuser/');
await expect(page.getByRole('heading', { name: 'Automation User'})).toHaveText('Automation User')

// Cover photo:

await expect(page.getByRole('img', { name: 'playwrightuser'})).toBeVisible();

// Profile / avatar photo:
// The alt text of the cover photo is 'playrwightuser' and the alt text of the profile photo is 'Automations User'. The alt texts are different.

await expect(page.getByAltText('Automation User')).toBeVisible;


})

