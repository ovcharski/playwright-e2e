import test, { expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';

test('Logout successful', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await page.goto('login/');

    // Verify user is logged in
    await expect(page.getByRole('link', { name: 'Automation User' })).toBeVisible();
    await expect(page.getByText('Automation User')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Your account' })).toBeVisible();

    // Perform logout
    await loginPage.logout();

    // Verify user is logged out - should see Login heading
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});
