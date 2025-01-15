import { test, expect } from '@playwright/test';

const baseURL = 'https://ovcharski.com/shop/';

// Test data
const orderData = {
    firstOrder: {
        firstName: 'Test',
        lastName: 'Order',
        street: 'Neznajna 13',
        city: 'Pomorie',
        region: 'Burgas',
        postcode: '1000',
        phone: '358776776',
        email: 'mail@mail.com'
    },
    secondOrder: {
        firstName: 'Alen',
        lastName: 'Delon',
        street: 'Rakovska street 224',
        apartment: '13',
        city: 'Lom',
        region: 'Vidin',
        postcode: '7386',
        phone: '35987654321',
        email: 'lom@lom.com'
    }
};

test.use({ storageState: "./NoAuth.json" });

// Helper function to fill checkout form
async function fillCheckoutForm(page, data) {
    await page.locator('#billing_first_name').fill(data.firstName);
    await page.locator('#billing_last_name').fill(data.lastName);
    await page.getByRole('textbox', { name: 'Street address *' }).fill(data.street);
    if (data.apartment) {
        await page.getByRole('textbox', { name: 'Apartment, suite, unit, etc. (optional)' }).fill(data.apartment);
    }
    await page.getByRole('textbox', { name: 'Town / City *' }).fill(data.city);
    await page.getByRole('textbox', { name: 'Sofia' }).click();
    await page.getByRole('option', { name: data.region }).click();
    await page.getByRole('textbox', { name: 'Postcode / ZIP *' }).fill(data.postcode);
    await page.getByLabel('Phone *').fill(data.phone);
    await page.getByLabel('Email address *').fill(data.email);
}

// Helper function to verify order success
async function verifyOrderSuccess(page) {
    await expect(page.getByRole('heading', { name: 'Order received' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Order received' })).toHaveText('Order received');
    await expect(page.getByText('Thank you. Your order has been received.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Order details' })).toBeVisible();
}

test('Make an order @Orders @Regression', async ({ page }) => {
    // Navigate to product and add to cart
    await page.goto(baseURL);
    await page.getByLabel('Visit product category Jenkins Artwork').click();
    await expect(page).toHaveURL(`${baseURL}product-category/jenkins-artwork/`);

    await page.getByRole('link', { name: 'Jenkins Cosmonaut Jenkins Cosmonaut 20,00 лв.' }).click();
    await expect(page).toHaveURL(`${baseURL}product/jenkins-cosmonaut/`);

    await page.getByRole('button', { name: 'Add to cart' }).click();

    // Navigate to checkout
    await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
    await expect(page).toHaveURL(`${baseURL}cart/`);

    await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    await expect(page).toHaveURL(`${baseURL}checkout/`);

    // Fill checkout form and place order
    await fillCheckoutForm(page, orderData.firstOrder);
    await page.getByRole('button', { name: 'Place order' }).click();

    // Verify order success
    await verifyOrderSuccess(page);
});

test('Making an order via search @Orders @Regression', async ({ page }) => {
    // Search for product and add to cart
    await page.goto(baseURL);
    await page.getByRole('searchbox', { name: 'Search for:' }).fill('Jenkinstein');
    await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');

    await expect(page).toHaveURL(`${baseURL}product/jenkins-jenkinstein/`);
    await page.getByRole('button', { name: 'Add to cart' }).click();

    // Navigate to checkout
    await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
    await expect(page).toHaveURL(`${baseURL}cart/`);

    await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
    await expect(page).toHaveURL(`${baseURL}checkout/`);

    // Fill checkout form and place order
    await fillCheckoutForm(page, orderData.secondOrder);
    await page.getByRole('button', { name: 'Place order' }).click();

    // Verify order success
    await verifyOrderSuccess(page);
});