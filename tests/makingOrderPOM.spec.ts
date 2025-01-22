import test, { expect } from '@playwright/test';
import CheckoutPage from '../pages/CheckoutPage';
import { faker } from '@faker-js/faker';

const baseURL = 'https://ovcharski.com/shop/';
const PHONE_NUMBER = '0883883883';

// Function to generate random checkout data
function generateCheckoutData() {
    return {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        company: faker.company.name(),
        streetaddress: faker.location.streetAddress(),
        apaddress: faker.location.secondaryAddress(),
        towncity: faker.location.city(),
        postcode: faker.location.zipCode(),
        phone: PHONE_NUMBER, // Using hardcoded phone number to pass shop validation. With Faker is flaky
        email: faker.internet.email(),
    };
}

// Helper to fill checkout form and place the order
async function completeCheckout(page: any, checkoutPage: CheckoutPage) {
    const data = generateCheckoutData();
    await checkoutPage.fillCheckoutForm(
        data.firstname,
        data.lastname,
        data.company,
        data.streetaddress,
        data.apaddress,
        data.towncity,
        data.postcode,
        data.phone,
        data.email,
    );
    await checkoutPage.placeOrder();
}

test.use({ storageState: './NoAuth.json' });

test('Making an order', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    // Navigate to product page and add item to cart
    await page.goto(baseURL);
    await page.getByLabel('Visit product category Jenkins Artwork').click();
    await expect(page).toHaveURL(`${baseURL}product-category/jenkins-artwork/`);
    await page.getByRole('link', { name: 'Jenkins Cosmonaut Jenkins Cosmonaut 20,00 лв.' }).click();
    await expect(page).toHaveURL(`${baseURL}product/jenkins-cosmonaut/`);
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // Go to checkout
    await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
    await expect(page).toHaveURL(`${baseURL}cart/`);
    await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    await expect(page).toHaveURL(`${baseURL}checkout/`);

    // Complete checkout
    await completeCheckout(page, checkout);

    // Assertions
    await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
    await expect(page.getByText('Thank you. Your order has been received.')).toBeVisible();
});

test('Making an order via search', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    // Search and add product to cart
    await page.goto(baseURL);
    await page.getByRole('searchbox', { name: 'Search for:' }).fill('Jenkinstein');
    await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');
    await expect(page).toHaveURL(`${baseURL}product/jenkins-jenkinstein/`);
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // Go to checkout
    await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
    await expect(page).toHaveURL(`${baseURL}cart/`);
    await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    await expect(page).toHaveURL(`${baseURL}checkout/`);

    // Complete checkout
    await completeCheckout(page, checkout);

    // Assertions
    await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
});