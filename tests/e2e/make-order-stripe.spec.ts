import test, { expect } from '@playwright/test';
import CheckoutPage from '../../pages/CheckoutPage';
import { faker } from '@faker-js/faker';

test('Make an order and pay with VISA Card', async ({ page }) => {
  // Go to the shop page and add a product to the cart
  await page.goto('https://ovcharski.com/shop/');
  await page.locator('#menu-item-126').getByRole('link', { name: 'Shop' }).click();
  await page.getByRole('link', { name: 'Hat 12,00 лв' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // Proceed to checkout
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByRole('link', { name: 'Proceed to checkout ' }).click();

  // Fill in the card payment details
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('Card number')).toBeVisible();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('1234 1234 1234').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('1234 1234 1234').fill('4242 4242 4242 4242');
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('MM / YY')).toBeVisible();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('MM / YY').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('MM / YY').fill('11/28');
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('CVC').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('CVC').fill('123');

  // Place the order
  await page.getByRole('button', { name: 'Place order' }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
  await expect(page.getByText('Thank you. Your order has been received.')).toBeVisible();
});

test('Make an order and pay with Mastercard Card', async ({ page }) => {
  // Go to the shop page and add a product to the cart
  await page.goto('https://ovcharski.com/shop/');
  await page.locator('#menu-item-126').getByRole('link', { name: 'Shop' }).click();
  await page.getByRole('link', { name: 'Hat 12,00 лв' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // Proceed to checkout
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByRole('link', { name: 'Proceed to checkout ' }).click();

  // Fill in the card payment details
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('Card number')).toBeVisible();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('1234 1234 1234').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('1234 1234 1234').fill('5555 5555 5555 4444');
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('MM / YY').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('MM / YY').fill('11/28');
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('CVC').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('CVC').fill('123');

  // Place the order
  await page.getByRole('button', { name: 'Place order' }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
  await expect(page.getByText('Thank you. Your order has been received.')).toBeVisible();
});

test('Make an order and pay with American Express Card', async ({ page }) => {
  // Go to the shop page and add a product to the cart
  await page.goto('https://ovcharski.com/shop/');
  await page.locator('#menu-item-126').getByRole('link', { name: 'Shop' }).click();
  await page.getByRole('link', { name: 'Hat 12,00 лв' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // Proceed to checkout
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByRole('link', { name: 'Proceed to checkout ' }).click();

  // Fill in the card payment details
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('Card number')).toBeVisible();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('1234 1234 1234').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('1234 1234 1234').fill('3782 822463 10005');
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('MM / YY').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('MM / YY').fill('11/28');
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('CVC').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('CVC').fill('1234');

  // Place the order
  await page.getByRole('button', { name: 'Place order' }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
  await expect(page.getByText('Thank you. Your order has been received.')).toBeVisible();
});

test('Make an order and enter invalid card number', async ({ page }) => {
  // Go to the shop page and add a product to the cart
  await page.goto('https://ovcharski.com/shop/');
  await page.locator('#menu-item-126').getByRole('link', { name: 'Shop' }).click();
  await page.getByRole('link', { name: 'Hat 12,00 лв' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // Proceed to checkout
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByRole('link', { name: 'Proceed to checkout ' }).click();

  // Fill in the card payment details
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('Card number')).toBeVisible();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('1234 1234 1234').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('1234 1234 1234').fill('3782');
  await page.keyboard.press('Tab');
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('Your card number is')).toBeVisible();
});


test('Make an order and enter invalid card date', async ({ page }) => {
  // Go to the shop page and add a product to the cart
  await page.goto('https://ovcharski.com/shop/');
  await page.locator('#menu-item-126').getByRole('link', { name: 'Shop' }).click();
  await page.getByRole('link', { name: 'Hat 12,00 лв' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // Proceed to checkout
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByRole('link', { name: 'Proceed to checkout ' }).click();

  // Fill in the card payment details
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('Card number')).toBeVisible();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('MM / YY').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('MM / YY').fill('11/24');
  await page.keyboard.press('Tab');
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('Your card’s expiration year')).toBeVisible();
});

test('Make an order and enter invalid CVC number', async ({ page }) => {
  // Go to the shop page and add a product to the cart
  await page.goto('https://ovcharski.com/shop/');
  await page.locator('#menu-item-126').getByRole('link', { name: 'Shop' }).click();
  await page.getByRole('link', { name: 'Hat 12,00 лв' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();

  // Proceed to checkout
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByRole('link', { name: 'Proceed to checkout ' }).click();

  // Fill in the card payment details
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('Card number')).toBeVisible();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('CVC').click();
  await page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByPlaceholder('CVC').fill('1');
  await page.keyboard.press('Tab');
  await expect(page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame().getByText('Your card’s security code is')).toBeVisible();
});




