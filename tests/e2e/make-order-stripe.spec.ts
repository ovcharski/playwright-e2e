import { test, type Page } from '@playwright/test';
import CheckoutPage from '../../pages/CheckoutPage';
import { faker } from '@faker-js/faker';

// Constants
const PHONE_NUMBER = '0883883883';

// Generate dynamic expiry date (3 years in the future)
function getFutureExpiryDate(): string {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 3);
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const year = String(futureDate.getFullYear()).slice(-2);
    return `${month}/${year}`;
}

const validExpiryDate = getFutureExpiryDate();

// Helper Functions
function generateCheckoutData() {
    return {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        company: faker.company.name(),
        streetaddress: faker.location.streetAddress(),
        apaddress: faker.location.secondaryAddress(),
        towncity: faker.location.city(),
        postcode: faker.location.zipCode(),
        phone: PHONE_NUMBER,
        email: faker.internet.email(),
    };
}

async function completeCheckout(page: Page, checkoutPage: CheckoutPage) {
    const data = generateCheckoutData();
    await checkoutPage.fillCheckoutForm(data);
}

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
    { name: 'invalid CVC number', number: '4242 4242 4242 4242', expiry: validExpiryDate, cvc: '12', error: "Your card's security code is incomplete." },
];

test.describe('Checkout and Payment Tests', () => {
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);

        // Navigate to the shop and add a product to the cart
        await page.goto('');
        await page.locator('#menu-item-126').getByRole('link', { name: 'Shop' }).click();
        await page.getByRole('link', { name: 'Hat 12,00 €' }).click();
        await page.getByRole('button', { name: 'Add to cart', exact: true }).click();

        // Proceed to checkout
        await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
        await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    });

    // Data-driven tests for valid card payments
    validCards.forEach((card) => {
        test(`Make an order and pay with ${card.name} Card`, async ({ page }) => {
            await completeCheckout(page, checkoutPage);
            await checkoutPage.fillCardDetails(card.number, validExpiryDate, card.cvc);
            await page.getByText('Credit / Debit Card').click();
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
