import test, { expect, type Page } from '@playwright/test';
import CheckoutPage from '../../pages/CheckoutPage';
import { faker } from '@faker-js/faker';

// Constants
const PHONE_NUMBER = '0883883883';

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

// Test Configuration
test.use({ storageState: './NoAuth.json' });

// Test Suite
test('Make an order', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    // Navigate to homepage and browse to Jenkins Artwork category
    await page.goto('');
    await page.getByLabel('Visit product category Jenkins Artwork').click();
    await expect(page).toHaveURL('product-category/jenkins-artwork/');

    // Select Jenkins Cosmonaut product
    await page.getByRole('link', { name: 'Jenkins Cosmonaut Jenkins Cosmonaut 20,00 лв.' }).click();
    await expect(page).toHaveURL('product/jenkins-cosmonaut/');

    // Add product to cart
    await page.getByRole('button', { name: 'Add to cart', exact: true }).click();

    // View cart
    await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
    await expect(page).toHaveURL('cart/');

    // Proceed to checkout
    await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    await expect(page).toHaveURL('checkout/');

    // Fill checkout form and select payment method
    await completeCheckout(page, checkout);
    await page.getByText('Cash on delivery').click();
    await checkout.placeOrder();

    // Verify order confirmation
    await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
    await expect(page.getByText('Thank you. Your order has been received.')).toBeVisible();
});

test('Make an order via search', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    // Search for product
    await page.goto('');
    await page.getByRole('searchbox', { name: 'Search for:' }).fill('Jenkinstein');
    await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');
    await expect(page).toHaveURL('product/jenkins-jenkinstein/');

    // Add product to cart
    await page.getByRole('button', { name: 'Add to cart', exact: true }).click();

    // View cart
    await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
    await expect(page).toHaveURL('cart/');

    // Proceed to checkout
    await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    await expect(page).toHaveURL('checkout/');

    // Fill checkout form and complete order
    await completeCheckout(page, checkout);
    await page.getByText('Cash on delivery').click();
    await checkout.placeOrder();

    // Verify order confirmation
    await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
});
