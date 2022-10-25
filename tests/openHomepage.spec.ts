import { test, expect } from '@playwright/test';
test('Open homepage and check few texts', async ({ page }) => {


  // Go to https://ovcharski.com/shop/
  await page.goto('https://ovcharski.com/shop/');

  // Check website title (visible in the page)
  await expect(page.locator('a:has-text("Automation Demo Site")')).toBeVisible;
  await expect(page.locator('a:has-text("Automation Demo Site")')).toHaveText("Automation Demo Site");

  // Check another text on the page
  await expect(page.locator('text=Welcome to the store')).toHaveText("Welcome to the store");

  // Check Footer
  await expect (page.locator('text=© Automation Demo Site 2022 Built with Storefront & WooCommerce.')).toContainText("© Automation Demo Site 2022");


});