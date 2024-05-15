import { test, expect } from '@playwright/test';

test('Check prices of a products', async ({ page }) => {
  await page.goto('/shop/product-category/jenkins-artwork/');
  
  await page.getByRole('link', { name: 'Jenkins Beekeeper Jenkins' }).click();

  // Locators are strict. This means that all operations on locators that imply some target DOM element will throw an exception if more than one element matches. 
  // You can explicitly opt-out from strictness check by telling Playwright which element to use when multiple elements match, through locator.first(), locator.last(), and locator.nth().

  await expect(page.locator('#product-122 del').getByText('20,00 лв').first()).toBeVisible();
  await expect(page.locator('#product-122').getByText('15,99 лв').first()).toBeVisible();

  await page.goto('/shop/product-category/jenkins-artwork/');
  await page.getByRole('link', { name: 'Jenkins Magician' }).first().click();
  await expect(page.getByText('Sale!')).toBeVisible;
  await expect(page.locator('#product-104 del').getByText('20,00 лв').first()).toBeVisible();
  await expect(page.locator('#product-104').getByText('9,99 лв').first()).toBeVisible();


});