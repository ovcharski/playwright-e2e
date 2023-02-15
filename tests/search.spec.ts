import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://ovcharski.com/shop/');
});

test.afterEach(async ({ page }) => {
    await page.close();
})

const search = '#woocommerce-product-search-field-0';

test.describe('Search for products', () => {
    test('Search for a music album', async ({ page }) => {
        await page.locator(search).fill('Album');
        await page.locator(search).press('Enter');

        await expect(page.getByText('SKU: woo-album')).toBeVisible();
        await expect(page).toHaveURL('https://ovcharski.com/shop/product/album/');
        })

    test('Search for a Beanie with Logo', async ({ page }) => {
        await page.locator(search).fill('Beanie with Logo');
        await page.locator(search).press('Enter');

        await expect(page.getByText('SKU: Woo-beanie-logo')).toBeVisible();
        await expect(page).toHaveURL('https://ovcharski.com/shop/product/beanie-with-logo/');
        })

    test('Search for Jenkins', async ({ page }) => {
        await page.locator(search).fill('Jenkins');
        await page.locator(search).press('Enter');

        await expect(page.getByLabel('breadcrumbs')).toBeVisible
        await expect(page.getByLabel('breadcrumbs')).toContainText('Search results for “Jenkins”');
        await expect(page).toHaveURL('https://ovcharski.com/shop/?s=Jenkins&post_type=product');
        })
});