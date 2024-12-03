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

    // Screenshot first tab with timestamp
    await page.screenshot({ path: `screenshots/wikipedia-${Date.now()}.png` });

    // Screenshot second tab with timestamp
    await newTab.screenshot({ path: `screenshots/mediawiki-${Date.now()}.png` });

    // Close second tab
    await newTab.close();
    await page.close();
});