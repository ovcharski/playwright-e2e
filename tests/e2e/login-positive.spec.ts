import { test, expect } from '../../fixtures/test-fixtures';
import { testUser } from '../../helpers/test-user';

test.use({ storageState: './NoAuth.json' });

test('Login successful', async ({ page, loginPage }) => {
    await page.goto('login/');
    await loginPage.login(testUser.username, testUser.password);

    // Validate the login process
    await expect(page).toHaveTitle('User – Automation Demo Site');
    await expect(page).toHaveURL(testUser.profilePath);
    await expect(page.getByRole('heading', { name: testUser.displayName })).toBeVisible();

    // Validate cover photo
    await expect(page.getByRole('img', { name: testUser.username })).toBeVisible();
    await expect(page.getByAltText(testUser.displayName)).toBeVisible();
});
