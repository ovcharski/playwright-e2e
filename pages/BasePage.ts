import { Page, Locator, expect, test } from '@playwright/test';
import { TIMEOUTS } from '../constants/timeouts';

export default abstract class BasePage {
    protected constructor(protected page: Page) {}

    // Common method to fill any input field
    protected async typeIntoLocator(locator: Locator, value: string) {
        await locator.fill(value);
    }

    // Common method to click any element
    protected async clickElement(locator: Locator, options: { timeout?: number } = {}) {
        const { timeout = TIMEOUTS.ACTION } = options;
        await locator.click({ timeout });
    }

    // Common method to verify text content
    protected async verifyText(locator: Locator, expectedText: string, exact: boolean = false) {
        if (exact) {
            await expect(locator).toHaveText(expectedText);
        } else {
            // Use contains for partial matching and normalize whitespace
            await expect(locator).toContainText(expectedText);
        }
    }

    protected async verifyTextWithOptions(
        locator: Locator,
        expectedText: string,
        options: {
            exact?: boolean;
            normalizeWhitespace?: boolean;
            timeout?: number;
        } = {},
    ) {
        const { exact = false, normalizeWhitespace = true, timeout = TIMEOUTS.SHORT } = options;

        if (normalizeWhitespace) {
            // Escape regex metacharacters first so text like "(" or "." matches
            // literally, then let any run of whitespace match any other.
            // Note: replaceAll() doesn't support regex, must use replace() with global flag
            const escaped = expectedText.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
            await expect(locator).toHaveText(new RegExp(escaped.replace(/\s+/g, String.raw`\s+`)), {
                timeout,
            });
        } else if (exact) {
            await expect(locator).toHaveText(expectedText, { timeout });
        } else {
            await expect(locator).toContainText(expectedText, { timeout });
        }
    }

    // Common method to verify element visibility
    protected async verifyElementVisible(locator: Locator, options: { timeout?: number } = {}) {
        const { timeout = TIMEOUTS.ACTION } = options;
        await expect(locator).toBeVisible({ timeout });
    }

    // Attaches the screenshot to the running test, so it shows up in the HTML
    // report (which CI uploads) instead of piling up in a local folder.
    public async captureScreenshot(screenshotName: string, fullPage: boolean = false) {
        await test.info().attach(screenshotName, {
            body: await this.page.screenshot({ fullPage }),
            contentType: 'image/png',
        });
    }

    // Common method to fill out a form with multiple fields
    protected async fillForm(fields: { [selector: string]: string }) {
        for (const [selector, value] of Object.entries(fields)) {
            await this.typeIntoLocator(this.page.locator(selector), value);
        }
    }

    // Common method to navigate to a URL
    protected async navigate(url: string) {
        await this.page.goto(url);
    }
}
