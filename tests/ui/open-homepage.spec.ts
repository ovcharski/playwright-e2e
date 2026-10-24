import { test } from '@playwright/test';
import HomePage from '../../pages/HomePage';

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test('Open homepage', async ({ page }) => {
    const homePage = new HomePage(page);

    // Go to homepage
    await page.goto('');

    // Verify text on the homepage
    await homePage.verifyWelcomeText('Welcome to the store');

    // Verify footer content with complete text
    // The site renders the current year in the footer
    await homePage.verifyFooterText(`© Automation Demo Site ${new Date().getFullYear()} Built with WooCommerce`);

    // Capture screenshots
    await homePage.captureHomePageScreenshot('homepage');
    await homePage.captureFullPageScreenshot('homepage');
});
