import { test } from "@playwright/test"

test('Multiple tabs example', async ({ page, context }) => {

// First tab
    await page.goto('https://en.wikipedia.org/');

// Create second tab
const newTab = await context.newPage();

// Open page in second tab
await newTab.goto('https://www.mediawiki.org');

// Bring first tab (Wikipedia) to front
await page.bringToFront();

// Screenshot first tab
await page.screenshot({ path: 'screenshots/screenshotWikipedia.png' });

// Screenshot second tab
await newTab.screenshot({ path: 'screenshots/screenshotMediaWiki.png' });

// Close second tab
await newTab.close();

await page.close();

});

