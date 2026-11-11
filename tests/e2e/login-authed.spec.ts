import test, { expect } from '@playwright/test';
import { testUser } from '../../helpers/test-user';

test('User should be logged in', async ({ page }) => {
    await page.goto('login/');

    await expect(page.getByRole('link', { name: testUser.displayName })).toBeVisible();
    await expect(page.getByText(testUser.displayName)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Your account' })).toBeVisible();
});
