import { test } from '../../fixtures/test-fixtures';

// Device viewport configurations
const viewports = [
    { name: 's10', width: 360, height: 760 },
    { name: 's20', width: 360, height: 800 },
    { name: 's20-ultra', width: 412, height: 915 },
    { name: 'SE', width: 375, height: 667 },
];

// Dynamically generate tests for each viewport
viewports.forEach((viewport) => {
    test.describe(`${viewport.name.toUpperCase()} viewport`, () => {
        test.use({ viewport: { width: viewport.width, height: viewport.height } });

        test('Open Homepage Mobile', async ({ page, homePage }) => {
            await page.goto('');

            await homePage.verifyWelcomeText('Welcome to the store');

            // The site renders the current year in the footer
            await homePage.verifyFooterText(
                `© Automation Demo Site ${new Date().getFullYear()} Built with WooCommerce.`,
            );

            await homePage.captureScreenshot(viewport.name);
            await homePage.captureFullPageScreenshot(viewport.name);
        });
    });
});
