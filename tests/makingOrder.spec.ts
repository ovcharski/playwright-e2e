import { test, expect } from '@playwright/test';

const baseURL = 'https://ovcharski.com/shop/'

test('Make an order @Orders @Regression', async ({ page }) => {

await page.goto(baseURL);

// The next line no longer works. Changing the getByRole locator to getByLabel
// await page.getByRole('link', { name: 'Jenkins Artwork Jenkins Artwork (10)' }).click();
await page.getByLabel('Visit product category Jenkins Artwork').click();
await expect(page).toHaveURL('https://ovcharski.com/shop/product-category/jenkins-artwork/');

await page.getByRole('link', { name: 'Jenkins Cosmonaut Jenkins Cosmonaut 20,00 лв.' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/product/jenkins-cosmonaut/');

await page.getByRole('button', { name: 'Add to cart' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/product/jenkins-cosmonaut/');

await page.locator('div[role="alert"]:has-text("View cart “Jenkins Cosmonaut” has been added to your cart.")').getByRole('link', { name: 'View cart ' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/cart/');

await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/checkout/');

await page.locator('#billing_first_name').click();
// await page.getByRole('textbox', { name: 'First name *' }).click();

await page.locator('#billing_first_name').fill('Test');

// await page.getByRole('textbox', { name: 'First name *' }).fill('Test');

await page.locator('#billing_last_name').click();

// await page.getByRole('textbox', { name: 'Last name *' }).click();

await page.locator('#billing_last_name').fill('Order');

// await page.getByRole('textbox', { name: 'Last name *' }).fill('Order');

await page.getByRole('textbox', { name: 'Street address *' }).click();

await page.getByRole('textbox', { name: 'Street address *' }).fill('Neznajna 13');

await page.getByRole('textbox', { name: 'Town / City *' }).click();

await page.getByRole('textbox', { name: 'Town / City *' }).fill('Pomorie');

await page.getByRole('textbox', { name: 'Sofia' }).click();

await page.getByRole('option', { name: 'Burgas' }).click();

await page.getByRole('textbox', { name: 'Postcode / ZIP *' }).click();

await page.getByRole('textbox', { name: 'Postcode / ZIP *' }).fill('1000');

await page.getByLabel('Phone *').click();

await page.getByLabel('Phone *').fill('358776776');

await page.getByLabel('Email address *').click();

await page.getByLabel('Email address *').fill('mail@mail.com');

await page.getByRole('button', { name: 'Place order' }).click();

// await page.goto('https://ovcharski.com/shop/checkout/order-received/152/?key=wc_order_zkN84dusC6yCe');

await expect (page.getByRole('heading', { name: 'Order received' })).toBeVisible();

await expect (page.getByRole('heading', { name: 'Order received' })).toHaveText('Order received');

await expect (page.getByText('Thank you. Your order has been received.')).toHaveText('Thank you. Your order has been received.'); 

await expect (page.getByRole('heading', { name: 'Order details' })).toHaveText('Order details');

await page.close();

});



test('Making an order via search @Orders @Regression', async ({ page }) => {

await page.goto(baseURL);

await page.getByRole('searchbox', { name: 'Search for:' }).click();

await page.getByRole('searchbox', { name: 'Search for:' }).fill('Jenkinstein');

await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');
await expect(page).toHaveURL('https://ovcharski.com/shop/product/jenkins-jenkinstein/');

await page.getByRole('button', { name: 'Add to cart' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/product/jenkins-jenkinstein/');

await page.locator('div[role="alert"]:has-text("View cart “Jenkins Jenkinstein” has been added to your cart.")').getByRole('link', { name: 'View cart ' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/cart/');

await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/checkout/');

await page.locator('#billing_first_name').click();

await page.locator('#billing_first_name').fill('Alen');

await page.locator('#billing_last_name').click();

await page.locator('#billing_last_name').fill('Delon');

// await page.getByRole('textbox', { name: 'Company name (optional)' }).click();

// await page.getByRole('textbox', { name: 'Company name (optional)' }).fill('Apple Inc');

await page.getByRole('textbox', { name: 'Street address *' }).click();

await page.getByRole('textbox', { name: 'Street address *' }).fill('NEznajna street 224');

await page.getByRole('textbox', { name: 'Apartment, suite, unit, etc. (optional)' }).click();

await page.getByRole('textbox', { name: 'Apartment, suite, unit, etc. (optional)' }).fill('13');

await page.getByRole('textbox', { name: 'Town / City *' }).click();

await page.getByRole('textbox', { name: 'Town / City *' }).fill('Lom');

await page.getByRole('textbox', { name: 'Sofia' }).click();

await page.getByRole('option', { name: 'Vidin' }).click();

await page.getByRole('textbox', { name: 'Postcode / ZIP *' }).click();

await page.getByRole('textbox', { name: 'Postcode / ZIP *' }).fill('7386');

await page.getByLabel('Phone *').click();

await page.getByLabel('Phone *').fill('35987654321');

await page.getByLabel('Email address *').click();

await page.getByLabel('Email address *').fill('lom@lom.com');

await page.getByRole('button', { name: 'Place order' }).click();

await page.close();

});