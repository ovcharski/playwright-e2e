import { test } from '../../fixtures/test-fixtures';
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

// Stripe test card that passes client-side validation but is declined by the
// server when the order is placed
const declinedCard = { number: '4000 0000 0000 0002', cvc: '123' };

// Stripe test card that always asks for 3D Secure authentication
const threeDSecureCard = { number: '4000 0025 0000 3155', cvc: '123' };

// Test data for invalid card scenarios
const invalidCardScenarios = [
    {
        name: 'invalid card number',
        number: '3782',
        expiry: validExpiryDate,
        cvc: '123',
        error: 'Your card number is incomplete.',
    },
    {
        name: 'invalid card date',
        number: '4242 4242 4242 4242',
        expiry: '11/24',
        cvc: '123',
        error: "Your card's expiration year is in the past.",
    },
    {
        name: 'invalid CVC number',
        number: '4242 4242 4242 4242',
        expiry: validExpiryDate,
        cvc: '12',
        error: 'Your security code is incomplete.',
    },
];

// Guest checkout: the logged-in user's cart is stored server-side, so the
// tests that never complete an order would leave their Hat behind for the
// next run to buy.
test.use({ storageState: './NoAuth.json' });

test.describe('Checkout and Payment Tests', () => {
    // Every test starts from the checkoutWithProduct fixture: a Hat in the
    // cart and the checkout page open.

    // Data-driven tests for valid card payments
    validCards.forEach((card) => {
        test(`Make an order and pay with ${card.name} Card`, async ({ checkoutWithProduct: checkoutPage }) => {
            await checkoutPage.fillCheckoutForm(buildBillingInfo());
            await checkoutPage.fillCardDetails(card.number, validExpiryDate, card.cvc);
            await checkoutPage.selectCardPayment();
            await checkoutPage.placeOrder();
            await checkoutPage.expectOrderReceived();
        });
    });

    test('Make an order and pay with a card that requires 3D Secure', async ({ checkoutWithProduct: checkoutPage }) => {
        await checkoutPage.fillCheckoutForm(buildBillingInfo());
        await checkoutPage.fillCardDetails(threeDSecureCard.number, validExpiryDate, threeDSecureCard.cvc);
        await checkoutPage.selectCardPayment();
        await checkoutPage.placeOrder();
        await checkoutPage.completeThreeDSecureChallenge();
        await checkoutPage.expectOrderReceived();
    });

    test('Make an order and pay with a declined card', async ({ checkoutWithProduct: checkoutPage }) => {
        await checkoutPage.fillCheckoutForm(buildBillingInfo());
        await checkoutPage.fillCardDetails(declinedCard.number, validExpiryDate, declinedCard.cvc);
        await checkoutPage.selectCardPayment();
        await checkoutPage.placeOrder();
        await checkoutPage.expectOrderDeclined();
    });

    // Data-driven tests for invalid card scenarios
    invalidCardScenarios.forEach((scenario) => {
        test(`Make an order and enter ${scenario.name}`, async ({ checkoutWithProduct: checkoutPage }) => {
            await checkoutPage.fillCardDetails(scenario.number, scenario.expiry, scenario.cvc);
            await checkoutPage.expectCardError(scenario.error);
        });
    });
});
