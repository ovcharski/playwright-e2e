import { test, expect } from '@playwright/test';

  test.describe('Galaxy S10 viewport', () => {
    test.use({ viewport: { width: 360, height: 760 } });
  
    test('Open Homepage', async ({ page }) => {


  await page.goto('/shop/');  
  await expect(page.locator('text=Welcome to the store')).toBeVisible;
  await page.screenshot({ path: 'screenshots/screenshot-s10.png' });
  await page.screenshot({ path: 'screenshots/screenshot-s10-full-page.png', fullPage: true });
  await page.close();

});
});

test.describe('Galaxy S20 viewport', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('Open Homepage', async ({ page }) => {


await page.goto('/shop/');  
await expect(page.locator('text=Welcome to the store')).toBeVisible;
await expect(page.getByRole('link', { name: ' My Account' })).toBeVisible;
await expect(page.getByRole('link', { name: ' Cart' })).toBeVisible;
await page.screenshot({ path: 'screenshots/screenshot-s20.png' });
await page.screenshot({ path: 'screenshots/screenshot-s20-full-page.png', fullPage: true });
await page.close();

});
});

test.describe('Galaxy S20 Ultra viewport', () => {
  test.use({ viewport: { width: 412, height: 915 } });

  test('Open Homepage', async ({ page }) => {


await page.goto('/shop/');  
await expect(page.locator('text=Welcome to the store')).toBeVisible;
await expect(page.getByRole('link', { name: ' My Account' })).toBeVisible;
await expect(page.getByRole('link', { name: ' Cart' })).toBeVisible;
await page.screenshot({ path: 'screenshots/screenshot-s20-ultra.png' });
await page.screenshot({ path: 'screenshots/screenshot-s20-ultra-full-page.png', fullPage: true });
await page.close();

});
});

test.describe('Galaxy iPhone SE 2 viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Open Homepage', async ({ page }) => {


await page.goto('/shop/');  
await expect(page.locator('text=Welcome to the store')).toBeVisible;
await expect(page.getByRole('link', { name: ' My Account' })).toBeVisible;
await expect(page.getByRole('link', { name: ' Cart' })).toBeVisible;
await page.screenshot({ path: 'screenshots/screenshot-SE.png' });
await page.screenshot({ path: 'screenshots/screenshot-SE-full-page.png', fullPage: true });
await page.close();

});
});

test.describe('Galaxy iPad OS viewport', () => {
  test.use({ viewport: { width: 810, height: 1080 } });

  test('Open Homepage', async ({ page }) => {


await page.goto('/shop/');  
await expect(page.locator('text=Welcome to the store')).toBeVisible;
await expect(page.getByRole('link', { name: ' My Account' })).toBeVisible;
await expect(page.getByRole('link', { name: ' Cart' })).toBeVisible;
await page.screenshot({ path: 'screenshots/screenshot-ipad.png' });
await page.screenshot({ path: 'screenshots/screenshot-ipad-full-page.png', fullPage: true });
await page.close();

});
});