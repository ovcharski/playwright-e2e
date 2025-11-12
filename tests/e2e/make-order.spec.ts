import test, { expect } from '@playwright/test';
import CheckoutPage from '../../pages/CheckoutPage';
import { faker } from '@faker-js/faker';

const PHONE_NUMBER = '0883883883';

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

test('Make an order', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await page.goto('');
    await page.getByLabel('Visit product category Jenkins Artwork').click();
    await expect(page).toHaveURL('product-category/jenkins-artwork/');
    await page.getByRole('link', { name: 'Jenkins Cosmonaut Jenkins Cosmonaut 20,00 лв.' }).click();
    await expect(page).toHaveURL('product/jenkins-cosmonaut/');
    await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
    await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
    await expect(page).toHaveURL('cart/');
    await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    await expect(page).toHaveURL('checkout/');
    await completeCheckout(page, checkout);
    await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
    await expect(page.getByText('Thank you. Your order has been received.')).toBeVisible();
});

test('Make an order via search', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await page.goto('');
    await page.getByRole('searchbox', { name: 'Search for:' }).fill('Jenkinstein');
    await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');
    await expect(page).toHaveURL('product/jenkins-jenkinstein/');
    await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
    await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
    await expect(page).toHaveURL('cart/');
    await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    await expect(page).toHaveURL('checkout/');
    await completeCheckout(page, checkout);
    await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
});