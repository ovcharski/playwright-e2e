import { test } from '@playwright/test';
import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import ProductPage from '../../pages/ProductPage';
import { buildBillingInfo } from '../../helpers/test-data';

// Generate dynamic expiry date (3 years in the future)
function getFutureExpiryDate(): string {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 3);
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const year = String(futureDate.getFullYear()).slice(-2);
    return `${month}/${year}`;
}

const validExpiryDate = getFutureExpiryDate();

// Test data for valid card payments
const validCards = [
    { name: 'VISA', number: '4242 4242 4242 4242', cvc: '123' },
    { name: 'Mastercard', number: '5555 5555 5555 4444', cvc: '123' },
    { name: 'American Express', number: '3782 822463 10005', cvc: '1234' },
];

// Test data for invalid card scenarios
const invalidCardScenarios = [
    { name: 'invalid card number', number: '3782', expiry: validExpiryDate, cvc: '123', error: 'Your card number is incomplete.' },
    { name: 'invalid card date', number: '4242 4242 4242 4242', expiry: '11/24', cvc: '123', error: "Your card's expiration year is in the past." },
    { name: 'invalid CVC number', number: '4242 4242 4242 4242', expiry: validExpiryDate, cvc: '12', error: 'Your security code is incomplete.' },
];

test.describe('Checkout and Payment Tests', () => {
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);
        const productPage = new ProductPage(page);
        const cart = new CartPage(page);

        // Navigate to the shop and add a product to the cart
        await page.goto('');
        await productPage.openShop();
        await productPage.clickProductLink('Hat');
        await cart.addToCart();

        // Proceed to checkout
        await cart.viewCart();
        await cart.proceedToCheckout();
    });

    // Data-driven tests for valid card payments
    validCards.forEach((card) => {
        test(`Make an order and pay with ${card.name} Card`, async () => {
            await checkoutPage.fillCheckoutForm(buildBillingInfo());
            await checkoutPage.fillCardDetails(card.number, validExpiryDate, card.cvc);
            await checkoutPage.selectCardPayment();
            await checkoutPage.placeOrder();
            await checkoutPage.expectOrderReceived();
        });
    });

    // Data-driven tests for invalid card scenarios
    invalidCardScenarios.forEach((scenario) => {
        test(`Make an order and enter ${scenario.name}`, async () => {
            await checkoutPage.fillCardDetails(scenario.number, scenario.expiry, scenario.cvc);
            await checkoutPage.expectCardError(scenario.error);
        });
    });
});
