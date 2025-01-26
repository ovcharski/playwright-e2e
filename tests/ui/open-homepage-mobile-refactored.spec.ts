import { test, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage';

// Common test setup to reduce repetition
const commonTestSetup = (viewportName: string) => {
  return async ({ page }) => {
    try {
      const homePage = new HomePage(page);

      // The empty object represents options passed to the goto() method.
      // This object could include several configuration options, such as: timeout, waitUntil, referer, headers
      await page.goto('/shop/', {});

      // Verify the welcome text using HomePage methods
      await homePage.verifyWelcomeText("Welcome to the store");

      // Verify the footer text using HomePage methods
      await homePage.verifyFooterText("© Automation Demo Site 2025 Built with WooCommerce.");

      // Capture screenshots with consistent naming
      await homePage.captureScreenshot(viewportName);
      await homePage.captureFullPageScreenshot(viewportName);

    } catch (error) {
      console.error(`Test failed for ${viewportName} viewport:`, error);
      throw error;
    } finally {
      await page.close();
    }
  };
};

// Device viewport configurations
const viewports = [
  { name: 's10', width: 360, height: 760 },
  { name: 's20', width: 360, height: 800 },
  { name: 's20-ultra', width: 412, height: 915 },
  { name: 'SE', width: 375, height: 667 },
];

// Dynamically generate tests for each viewport
viewports.forEach(viewport => {
  test.describe(`${viewport.name.toUpperCase()} viewport`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('Open Homepage Mobile', commonTestSetup(viewport.name));
  });
});
