import { test as setup, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import { testUser } from '../helpers/test-user';

// Runs once, in the "setup" project, before every other project. It logs in
// through the UI and saves the session to LoginAuth.json, which the other
// tests start from. Because it is an ordinary test, a failed login shows up in
// the HTML report with a trace and video like any other failure.
setup('log in and save the session', async ({ page }) => {
    // Fail with a clear message instead of a confusing login error.
    expect(
        testUser.username && testUser.password,
        'TEST_USERNAME and TEST_PASSWORD must be set (copy .env.example to .env)',
    ).toBeTruthy();

    const login = new LoginPage(page);
    await page.goto('login/');
    await login.login(testUser.username, testUser.password);

    await expect(page).toHaveTitle('User – Automation Demo Site');
    await expect(page).toHaveURL(testUser.profilePath);

    await page.context().storageState({ path: './LoginAuth.json' });
});
