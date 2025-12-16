import test, { expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';

const username = process.env.TEST_USERNAME!;
const password = process.env.TEST_PASSWORD!;

test.use({ storageState: './NoAuth.json' });
test('Login successful', async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto('login/');
    await login.login(username, password);

    // Validate the login process
    await expect(page).toHaveTitle('User – Automation Demo Site');
    await expect(page).toHaveURL('user/playwrightuser/');
    await expect(page.getByRole('heading', { name: 'Automation User' })).toHaveText('Automation User');

    // Validate cover photo
    await expect(page.getByRole('img', { name: 'playwrightuser' })).toBeVisible();
    await expect(page.getByAltText('Automation User')).toBeVisible();
});