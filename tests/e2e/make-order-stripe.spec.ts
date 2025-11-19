import { test } from '@playwright/test';
import CheckoutPage from '../../pages/CheckoutPage';

test.describe('Checkout and Payment Tests', () => {
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);

        // Navigate to the shop and add a product to the cart
        await page.goto('');
        await page.locator('#menu-item-126').getByRole('link', { name: 'Shop' }).click();
        await page.getByRole('link', { name: 'Hat 12,00 лв' }).click();
        await page.getByRole('button', { name: 'Add to cart', exact: true }).click();

        // Proceed to checkout
        await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
        await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    });

    test('Make an order and pay with VISA Card', async ({ page }) => {
        await checkoutPage.fillCardDetails('4242 4242 4242 4242', '11/28', '123');
        await page.getByText('Credit / Debit Card').click();
        await checkoutPage.placeOrder();
        await checkoutPage.expectOrderReceived();
    });

    test('Make an order and pay with Mastercard Card', async ({ page }) => {
        await checkoutPage.fillCardDetails('5555 5555 5555 4444', '11/28', '123');
        await page.getByText('Credit / Debit Card').click();
        await checkoutPage.placeOrder();
        await checkoutPage.expectOrderReceived();
    });

    test('Make an order and pay with American Express Card', async ({ page }) => {
        await checkoutPage.fillCardDetails('3782 822463 10005', '11/28', '1234');
        await page.getByText('Credit / Debit Card').click();
        await checkoutPage.placeOrder();
        await checkoutPage.expectOrderReceived();
    });

    test('Make an order and enter invalid card number', async () => {
        await checkoutPage.fillCardDetails('3782', '11/28', '123');
        await checkoutPage.expectCardError('Your card number is incomplete.');
    });

    test('Make an order and enter invalid card date', async () => {
        await checkoutPage.fillCardDetails('4242 4242 4242 4242', '11/24', '123');
        await checkoutPage.expectCardError('Your card’s expiration year is in the past.');
    });

    // test('Make an order and enter invalid CVC number', async () => {
    //     await checkoutPage.fillCardDetails('4242 4242 4242 4242', '11/28', '1');
    //     await checkoutPage.expectCardError('Your card’s security code is incomplete.');
    // });
});