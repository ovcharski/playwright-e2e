import test, { expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';

test.use({ storageState: './NoAuth.json' });
test('Login with wrong username and password', async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto('https://ovcharski.com/shop/login/');
    await login.login('playwrightuser99', 'playwrightuser88'); // Use the login method

    // Validate the login failure
    await expect(page).toHaveTitle('Login – Automation Demo Site');
    await expect(page).toHaveURL('https://ovcharski.com/shop/login/');
    await expect(page.getByText('Password is incorrect. Please try again.')).toHaveText(
        'Password is incorrect. Please try again.',
    );

    await page.close();
});