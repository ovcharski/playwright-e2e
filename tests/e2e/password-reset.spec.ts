import { test, expect } from '@playwright/test';
import { testUser } from '../../helpers/test-user';

test.use({ storageState: './NoAuth.json' });

// The site sends a reset email to the test account on every run. The test
// stops at the confirmation: the link in that email cannot be read from here.
test('Request a password reset', async ({ page }) => {
    await page.goto('login/');
    await page.getByRole('link', { name: 'Forgot your password?' }).click();
    await expect(page.getByRole('heading', { name: 'Password Reset' })).toBeVisible();

    // The field has no label, only a placeholder.
    await page.getByPlaceholder('Enter your username or email').fill(testUser.username);
    await page.getByRole('button', { name: 'Reset password' }).click();

    await expect(page).toHaveURL('password-reset/?updated=checkemail');
    await expect(page.getByText('we will send a password reset link. Please check your inbox.')).toBeVisible();
});
