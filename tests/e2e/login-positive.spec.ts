import test, { expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import { testUser } from '../../helpers/test-user';

test.use({ storageState: './NoAuth.json' });

test('Login successful', async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto('login/');
    await login.login(testUser.username, testUser.password);

    // Validate the login process
    await expect(page).toHaveTitle('User – Automation Demo Site');
    await expect(page).toHaveURL(testUser.profilePath);
    await expect(page.getByRole('heading', { name: testUser.displayName })).toBeVisible();

    // Validate cover photo
    await expect(page.getByRole('img', { name: testUser.username })).toBeVisible();
    await expect(page.getByAltText(testUser.displayName)).toBeVisible();
});
