import { test, expect, type Page } from '@playwright/test';

const testData = [
    { searchQuery: 'Album', sku: 'woo-album', url: 'https://ovcharski.com/shop/product/album/' },
    {
        searchQuery: 'Beanie with Logo',
        sku: 'Woo-beanie-logo',
        url: 'https://ovcharski.com/shop/product/beanie-with-logo/',
    },
    {
        searchQuery: 'Shirt Green',
        sku: 'woo-fasion-shirt-green',
        url: 'https://ovcharski.com/shop/product/shirt-green/',
    },
    { searchQuery: 'Shoes', sku: 'woo-fasion-shoes', url: 'https://ovcharski.com/shop/product/shoes/' },
    { searchQuery: 'Socks', sku: 'woo-fasion-socks', url: 'https://ovcharski.com/shop/product/socks/' },
    { searchQuery: 'V-Neck', sku: 'woo-vneck-tee', url: 'https://ovcharski.com/shop/product/v-neck-t-shirt/' },
    { searchQuery: 'Pennant', sku: 'wp-pennant', url: 'https://ovcharski.com/shop/product/wordpress-pennant/' },
    // Add more test data here
];

const search = '#woocommerce-product-search-field-0';

test.beforeEach(async ({ page }) => {
    await page.goto('https://ovcharski.com/shop/');
});

test.afterEach(async ({ page }) => {
    await page.close();
});

test.describe('Search for products with SKUs', () => {
    testData.forEach((data) => {
        test(`Search for a ${data.searchQuery}`, async ({ page }) => {
            await page.locator(search).fill(data.searchQuery);
            await page.locator(search).press('Enter');

            await expect(page.getByText(`SKU: ${data.sku}`)).toBeVisible();
            await expect(page).toHaveURL(data.url);
        });
    });
});
