import { test, expect } from '@playwright/test';

test('Check prices of a products', async ({ page }) => {
  await page.goto('/shop/product-category/jenkins-artwork/');
  await page.getByRole('link', { name: 'Jenkins Beekeeper Jenkins' }).click();
  await expect(page.locator('#product-122 del').getByText('20,00 лв').first()).toBeVisible();
  await expect(page.locator('#product-122').getByText('15,99 лв').first()).toBeVisible();

  await page.goto('/shop/product-category/jenkins-artwork/');
  await page.getByRole('link', { name: 'Jenkins Magician' }).first().click();
  await expect(page.getByText('Sale!')).toBeVisible();
  await expect(page.locator('#product-104 del').getByText('20,00 лв').first()).toBeVisible();
  await expect(page.locator('#product-104').getByText('9,99 лв').first()).toBeVisible();

  await page.close();
  
});