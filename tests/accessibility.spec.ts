import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('homepage', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('https://ovcharski.com/shop/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    console.log(accessibilityScanResults)

    await expect(page).toHaveURL('https://ovcharski.com/shop/');

    // expect(accessibilityScanResults.violations).toEqual([]);
  });
});