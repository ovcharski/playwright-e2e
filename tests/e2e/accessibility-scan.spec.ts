import type { Page, TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/test-fixtures';

// Scans the current page and returns its critical violations. Only those fail
// a test. Lower-impact ones (e.g. the site's current color-contrast issues)
// are logged but tolerated.
async function criticalViolations(page: Page, testInfo: TestInfo) {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Attach the full results to the HTML report, which CI uploads as an artifact
    await testInfo.attach('accessibility-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json',
    });

    // Log summary
    if (accessibilityScanResults.violations.length > 0) {
        console.warn(`\n⚠️  Found ${accessibilityScanResults.violations.length} accessibility violation type(s):`);
        accessibilityScanResults.violations.forEach((violation) => {
            console.warn(`   • ${violation.id} (${violation.impact}): ${violation.nodes.length} instance(s)`);
        });
        console.warn(`   📄 Full details attached to the HTML report as accessibility-results\n`);
    }

    return accessibilityScanResults.violations
        .filter((violation) => violation.impact === 'critical')
        .map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length} instance(s))`);
}

test.describe('Accessibility', () => {
    const pages = [
        { name: 'Homepage', path: '' },
        { name: 'Shop', path: 'shop/' },
        { name: 'Product', path: 'product/hat/' },
    ];

    pages.forEach(({ name, path }) => {
        test(`${name} should have no critical accessibility violations`, async ({ page }, testInfo) => {
            await page.goto(path);

            expect(await criticalViolations(page, testInfo)).toEqual([]);
        });
    });

    // The cart and checkout are scanned with a product in the cart, so they
    // run as a guest: the logged-in user's cart is stored on the server and
    // would keep the product between runs.
    test.describe('with a product in the cart', () => {
        test.use({ storageState: './NoAuth.json' });

        test('Cart should have no critical accessibility violations', async ({
            page,
            productPage,
            cartPage,
        }, testInfo) => {
            await productPage.navigateToProduct('product/hat/');
            await cartPage.addToCart();
            await cartPage.viewCart();

            expect(await criticalViolations(page, testInfo)).toEqual([]);
        });

        test('Checkout should have no critical accessibility violations', async ({
            page,
            checkoutWithProduct: _checkoutPage,
        }, testInfo) => {
            await expect(page.getByRole('button', { name: 'Place order' })).toBeVisible();

            expect(await criticalViolations(page, testInfo)).toEqual([]);
        });
    });
});
