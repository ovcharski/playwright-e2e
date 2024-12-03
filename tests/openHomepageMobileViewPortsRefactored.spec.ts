import { test, expect } from '@playwright/test';
import path from 'path';

// This code is copy of openHomepageMobileViewPorts.spec.ts but with refactored code. It's more DRY (Don't Repeat Yourself), with improved error handling, easier to maintain and extend

// Common test setup to reduce repetition
const commonTestSetup = (viewportName: string) => {
  return async ({ page }) => {
    try {
      // Navigate with more robust options
      await page.goto('/shop/', { 
      });
      
      await expect(page.locator('text=Welcome to the store')).toBeVisible();
      await expect(page.getByRole('link', { name: ' My Account' })).toBeVisible();
      await expect(page.getByRole('link', { name: ' Cart' })).toBeVisible();
      
      // Timestamp for unique screenshot names
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Screenshots with consistent naming
      await page.screenshot({ 
        path: `screenshots/screenshot-${viewportName}-${timestamp}.png` 
      });
      await page.screenshot({ 
        path: `screenshots/screenshot-${viewportName}-full-page-${timestamp}.png`, 
        fullPage: true 
      });
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
    
    test('Open Homepage', commonTestSetup(viewport.name));
  });
});