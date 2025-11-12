import { test, expect } from '@playwright/test';

test('Check if logo is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'online shop logo' })).toBeVisible();
});

// The test fails when running on GitHub Actions due to the different rendering of the logo

// test('Logo visual comparison', async ({ page }) => {
//   await page.goto('/');
  
//   const logo = page.getByRole('link', { name: 'online shop logo' });
//   await expect(logo).toHaveScreenshot('assets/images/logo-screenshot-chromium-win32.png', {
//     maxDiffPixelRatio: 0.01, // Allow 1% pixel difference
//     threshold: 0.1 // Pixel comparison threshold
//   });
// });