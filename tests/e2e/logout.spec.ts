import test, { expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';

const username = process.env.TEST_USERNAME!;
const password = process.env.TEST_PASSWORD!;

// Logging out destroys the session token server-side. With the shared
// LoginAuth.json state that would log out every test that runs after this
// file, so this test logs in with a session of its own.
test.use({ storageState: './NoAuth.json' });

test('Logout successful', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Log in with a fresh session
    await page.goto('login/');
    await loginPage.login(username, password);
    await expect(page).toHaveURL('user/playwrightuser/');

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
