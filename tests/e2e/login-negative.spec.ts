import { test, expect } from '../../fixtures/test-fixtures';

test.use({ storageState: './NoAuth.json' });

test('Login with wrong username and password', async ({ page, loginPage }) => {
    await page.goto('login/');
    await loginPage.login('playwrightuser99', 'playwrightuser88');

    // Validate the login failure
    await expect(page).toHaveTitle('Login – Automation Demo Site');
    await expect(page).toHaveURL('login/');
    await expect(page.getByText('Password is incorrect. Please try again.')).toBeVisible();
});
