import { test, expect } from '@playwright/test';

const testData = [
    { searchQuery: 'Album', sku: 'woo-album', url: 'product/album/' },
    {
        searchQuery: 'Beanie with Logo',
        sku: 'Woo-beanie-logo',
        url: 'product/beanie-with-logo/',
    },
    {
        searchQuery: 'Shirt Green',
        sku: 'woo-fasion-shirt-green',
        url: 'product/shirt-green/',
    },
    { searchQuery: 'Shoes', sku: 'woo-fasion-shoes', url: 'product/shoes/' },
    { searchQuery: 'Socks', sku: 'woo-fasion-socks', url: 'product/socks/' },
    { searchQuery: 'V-Neck', sku: 'woo-vneck-tee', url: 'product/v-neck-t-shirt/' },
    { searchQuery: 'Pennant', sku: 'wp-pennant', url: 'product/wordpress-pennant/' },
];

const search = '#woocommerce-product-search-field-0';

test.beforeEach(async ({ page }) => {
    await page.goto('');
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
