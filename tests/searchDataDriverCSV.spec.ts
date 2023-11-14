// Need more time to work on this

// import { test, expect, type Page } from '@playwright/test';
// import fs from 'fs';
// import csv from 'csv-parser';

// test.beforeEach(async ({ page }) => {
//     await page.goto('https://ovcharski.com/shop/');
// });

// test.afterEach(async ({ page }) => {
//     await page.close();
// })

// const search = '#woocommerce-product-search-field-0';


// interface TestData {
//     searchQuery: string;
//     sku: string;
//     url: string;
// }

// const testData: TestData[] = [];

// fs.createReadStream('assets/searchData.csv')
//     .pipe(csv())
//     .on('data', (data) => testData.push(data))
//     .on('end', () => {
//         test.describe('Search for products', () => {
//             testData.forEach((data) => {
//                 test(`Search for a ${data.searchQuery}`, async ({ page }) => {
//                     await page.locator(search).fill(data.searchQuery);
//                     await page.locator(search).press('Enter');

//                     await expect(page.getByText(`SKU: ${data.sku}`)).toBeVisible();
//                     await expect(page).toHaveURL(data.url);
//                 });
//             });
//         });
//     });

// Need more time to work on this

// import { test, expect } from '@playwright/test';
// import fs from 'fs';
// import csv from 'csvtojson';

// const csvFilePath = 'assets/searchData.csv'; // path to your CSV file
// const csvData = fs.readFileSync(csvFilePath, 'utf-8');
// const testData = await csv().fromString(csvData);

// test.beforeEach(async ({ page }) => {
//     await page.goto('https://ovcharski.com/shop/');
// });

// test.afterEach(async ({ page }) => {
//     await page.close();
// })

// const search = '#woocommerce-product-search-field-0';

// test.describe('Search for products', () => {
//     testData.forEach((data) => {
//         test(`Search for a ${data.searchQuery}`, async ({ page }) => {
//             await page.locator(search).fill(data.searchQuery);
//             await page.locator(search).press('Enter');

//             await expect(page.getByText(`SKU: ${data.sku}`)).toBeVisible();
//             await expect(page).toHaveURL(data.url);
//         });
//     });
// });
