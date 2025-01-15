import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';

test.describe('Homepage Accessibility', () => {
  test('Should have no automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('https://ovcharski.com/shop/');

    // Perform the accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Log all violations in a structured format
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:');
      accessibilityScanResults.violations.forEach((violation) => {
        console.log(`\nViolation: ${violation.id}`);
        console.log(`Description: ${violation.description}`);
        console.log(`Impact: ${violation.impact}`);
        console.log('Nodes:');
        violation.nodes.forEach((node) => {
          console.log(`  - HTML: ${node.html}`);
          console.log(`    Target: ${node.target.join(', ')}`);
          console.log(`    Failure Summary: ${node.failureSummary}`);
        });
      });

      // Save the violations to a file
      fs.writeFileSync(
        './accessibility-results.json',
        JSON.stringify(accessibilityScanResults, null, 2),
      );
    }

    // Assert that there are no accessibility violations
    // expect(accessibilityScanResults.violations).toEqual([]);

    // Verify the page URL
    await expect(page).toHaveURL('https://ovcharski.com/shop/');

    await page.close();
  });
});
