import { test, expect } from '@playwright/test';
import checkoutPage from '../pages/checkoutPage';

const baseURL = 'https://ovcharski.com/shop/'

test('Make an order POM @Orders @Regression', async ({ page }) => {

const checkout = new checkoutPage(page);

await page.goto(baseURL);

// The next line no longer works. Changing the getByRole locator to getByLabel
// await page.getByRole('link', { name: 'Jenkins Artwork Jenkins Artwork (10)' }).click();
await page.getByLabel('Visit product category Jenkins Artwork').click();
await expect(page).toHaveURL('https://ovcharski.com/shop/product-category/jenkins-artwork/');

await page.getByRole('link', { name: 'Jenkins Cosmonaut Jenkins Cosmonaut 0,00 лв.' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/product/jenkins-cosmonaut/');

await page.getByRole('button', { name: 'Add to cart' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/product/jenkins-cosmonaut/');

await page.locator('div[role="alert"]:has-text("View cart “Jenkins Cosmonaut” has been added to your cart.")').getByRole('link', { name: 'View cart ' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/cart/');

await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
await expect(page).toHaveURL('https://ovcharski.com/shop/checkout/');

await checkout.firstName('Kolio');

await checkout.lastName('Ivanov');

await checkout.streetAddress('Randomska 22');

await checkout.townCity('Pamporovo');

await checkout.stateCounty(); 
await page.getByRole('option', { name: 'Vratsa' }).click();

await checkout.postode('1111');

await checkout.phone('359123456789');

await checkout.email('mail@mail.com');

await checkout.placeOrderBtn();

await expect (page.getByRole('heading', { name: 'Order received' })).toBeVisible();

await expect (page.getByRole('heading', { name: 'Order received' })).toHaveText('Order received');

await expect (page.getByText('Thank you. Your order has been received.')).toHaveText('Thank you. Your order has been received.'); 

await expect (page.getByRole('heading', { name: 'Order details' })).toHaveText('Order details');

await page.close();

});



test('Making an order via search POM @Orders @Regression', async ({ page }) => {

const checkout = new checkoutPage(page);

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

await checkout.firstName('Ginka');

await checkout.lastName('Piperkova');

await checkout.companyName('Stomana Pernik');

await checkout.streetAddress('Predi mosta otsam rekata 34');

await checkout.apAddress('72');

await checkout.townCity('Troyan');

await checkout.stateCounty(); 
await page.getByRole('option', { name: 'Varna' }).click();

await checkout.postode('8888');

await checkout.phone('359123456789');

await checkout.email('mail@mail.com');

await checkout.placeOrderBtn();

await page.close();

});