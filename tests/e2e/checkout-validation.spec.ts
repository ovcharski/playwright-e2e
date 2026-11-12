import { test, expect } from '../../fixtures/test-fixtures';
import { buildBillingInfo } from '../../helpers/test-data';

// Guest session, so each test gets its own cart. WooCommerce rejects these
// submissions, so no order is placed.
test.use({ storageState: './NoAuth.json' });

const missingFields = [
    { name: 'first name', override: { firstname: '' }, error: 'Billing First name is a required field.' },
    { name: 'email address', override: { email: '' }, error: 'Billing Email address is a required field.' },
];

test.describe('Checkout validation', () => {
    missingFields.forEach(({ name, override, error }) => {
        test(`Order without a billing ${name} is rejected`, async ({ page, checkoutWithProduct: checkoutPage }) => {
            await checkoutPage.fillCheckoutForm(buildBillingInfo(override));
            await checkoutPage.selectCashOnDelivery();
            await checkoutPage.placeOrder();

            // Scoped to the billing form: the same text is repeated in a
            // notice at the top of the page.
            await expect(page.locator('.woocommerce-billing-fields').getByText(error)).toBeVisible();
            await expect(page).toHaveURL('checkout/');
        });
    });
});
