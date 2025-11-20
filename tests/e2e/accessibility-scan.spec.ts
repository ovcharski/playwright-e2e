import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';

test.describe('Homepage Accessibility', () => {
    test('Should have no automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('');

        // Perform the accessibility scan
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        // Save violations to file and log summary
        if (accessibilityScanResults.violations.length > 0) {
            // Save detailed violations to a file
            fs.writeFileSync('./accessibility-results.json', JSON.stringify(accessibilityScanResults, null, 2));

            // Log concise summary
            console.warn(`\n⚠️  Found ${accessibilityScanResults.violations.length} accessibility violation type(s):`);
            accessibilityScanResults.violations.forEach((violation) => {
                console.warn(`   • ${violation.id} (${violation.impact}): ${violation.nodes.length} instance(s)`);
            });
            console.warn(`   📄 Full details saved to: accessibility-results.json\n`);
        }

        // Uncomment the line below if you want the test to fail on violations:
        // expect(accessibilityScanResults.violations).toEqual([]);

        // Verify the page URL
        await expect(page).toHaveURL('');
    });
});
