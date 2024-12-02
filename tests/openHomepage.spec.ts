import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }, testInfo) => {
  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

  if (testInfo.status !== testInfo.expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test('Open homepage and test few texts @Regression', async ({ page }) => {


  // Go to https://ovcharski.com/shop/
  await page.goto('/shop/');
  
  // Check text on the page
  await expect(page.locator('text=Welcome to the store')).toBeVisible();
  await expect(page.locator('text=Welcome to the store')).toHaveText("Welcome to the store");

  // Check Footer
  await expect (page.locator('text=© Automation Demo Site 2024 Built with WooCommerce.')).toContainText("© Automation Demo Site 2024");

  // Capture screenshots with unique names
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `screenshots/homepage-${timestamp}.png` 
  });
  await page.screenshot({ 
    path: `screenshots/homepage-full-${timestamp}.png`, 
    fullPage: true 
  });

  await page.close();

});