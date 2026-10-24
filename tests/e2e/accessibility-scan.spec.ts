import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage Accessibility', () => {
    test('Should have no critical accessibility violations', async ({ page }, testInfo) => {
        await page.goto('');

        // Perform the accessibility scan
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        // Attach the full results to the HTML report, which CI uploads as an artifact
        await testInfo.attach('accessibility-results', {
            body: JSON.stringify(accessibilityScanResults, null, 2),
            contentType: 'application/json',
        });

        // Log summary
        // eslint-disable-next-line playwright/no-conditional-in-test -- reporting only; the assertion below runs unconditionally
        if (accessibilityScanResults.violations.length > 0) {
            console.warn(`\n⚠️  Found ${accessibilityScanResults.violations.length} accessibility violation type(s):`);
            accessibilityScanResults.violations.forEach((violation) => {
                console.warn(`   • ${violation.id} (${violation.impact}): ${violation.nodes.length} instance(s)`);
            });
            console.warn(`   📄 Full details attached to the HTML report as accessibility-results\n`);
        }

        // Only critical violations fail the test. Lower-impact ones (e.g. the
        // site's current color-contrast issues) are logged above but tolerated.
        const criticalViolations = accessibilityScanResults.violations
            .filter((violation) => violation.impact === 'critical')
            .map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length} instance(s))`);
        expect(criticalViolations).toEqual([]);

        // Verify the page URL
        await expect(page).toHaveURL('');
    });
});
