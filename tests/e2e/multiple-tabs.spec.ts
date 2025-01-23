import { test, expect } from '@playwright/test';

test('Verify navigation between multiple tabs', async ({ page, context }) => {
    // First tab
    await page.goto('https://en.wikipedia.org/');
    expect(await page.title()).toContain('Wikipedia');

    // Create second tab
    const newTab = await context.newPage();

    // Open page in second tab
    await newTab.goto('https://www.mediawiki.org');
    expect(await newTab.title()).toContain('MediaWiki');

    // Bring first tab (Wikipedia) to front
    await page.bringToFront();

    // Generate a timestamp for the screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Take screenshots
    await Promise.all([
        page.screenshot({ path: `screenshots/wikipedia-${timestamp}.png` }),
        newTab.screenshot({ path: `screenshots/mediawiki-${timestamp}.png` }),
    ]);

    // Close second tab
    await newTab.close();
    await page.close();
});