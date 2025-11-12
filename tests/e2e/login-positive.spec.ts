import test, { expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';

test.use({ storageState: './NoAuth.json' });
test('Login succesfull', async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto('login/');
    await login.login('playwrightuser', 'playwrightuser'); // Login method

    // Validate the login process
    await expect(page).toHaveTitle('User – Automation Demo Site');
    await expect(page).toHaveURL('user/playwrightuser/');
    await expect(page.getByRole('heading', { name: 'Automation User' })).toHaveText('Automation User');

    // Validate cover photo
    await expect(page.getByRole('img', { name: 'playwrightuser' })).toBeVisible();
    await expect(page.getByAltText('Automation User')).toBeVisible();
});