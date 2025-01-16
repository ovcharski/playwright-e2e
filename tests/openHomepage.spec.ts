import { test, expect } from '@playwright/test';
import HomePage from '../pages/homePage';

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus)
        console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test('Open homepage and test few texts @Regression', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Go to homepage
    await page.goto('/shop/');
    
    // Verify text on the homepage
    await homePage.verifyWelcomeText("Welcome to the store");
    
    // Verify footer content with complete text
    await homePage.verifyFooterText("© Automation Demo Site 2025 Built with WooCommerce");
    
    // Capture screenshots
    await homePage.captureHomePageScreenshot('homepage');
    await homePage.captureFullPageScreenshot('homepage');
    
    // Close the page after the test
    await page.close();
});