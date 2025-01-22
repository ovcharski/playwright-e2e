import { test, expect, type Page } from '@playwright/test';
import fs from 'fs';
import csv from 'csv-parser';

// This test is still under development and will not work as expected

interface TestData {
    searchQuery: string;
    sku: string;
    url: string;
}

const testData: TestData[] = [];

// Read and parse the CSV file
fs.createReadStream('assets/searchData.csv')
    .pipe(csv())
    .on('data', (row) => {
        testData.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });

const searchSelector = '#woocommerce-product-search-field-0';

async function searchProduct(page: Page, searchQuery: string) {
    await page.fill(searchSelector, searchQuery);
    await page.press(searchSelector, 'Enter');
}

test.beforeEach(async ({ page }) => {
    await page.goto('https://ovcharski.com/shop/');
});

test.afterEach(async ({ page }) => {
    await page.close();
});

test.describe('Search for products with SKUs from CSV', () => {
    testData.forEach((data) => {
        test(`Search for a ${data.searchQuery}`, async ({ page }) => {
            await searchProduct(page, data.searchQuery);
            await expect(page).toHaveURL(data.url);
        });
    });
});
