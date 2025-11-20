import { Page, Locator, expect } from '@playwright/test';

export default abstract class BasePage {
    protected constructor(protected page: Page) {}

    // Common method to fill any input field
    protected async typeIntoLocator(locator: Locator, value: string) {
        await locator.fill(value);
    }

    // Common method to click any element
    protected async clickElement(locator: Locator, options: { timeout?: number } = {}) {
        const { timeout = 25000 } = options;
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
        const { exact = false, normalizeWhitespace = true, timeout = 5000 } = options;

        if (normalizeWhitespace) {
            await expect(locator).toHaveText(new RegExp(expectedText.replace(/\s+/g, '\\s+')), {
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
        const { timeout = 25000 } = options;
        await expect(locator).toBeVisible({ timeout });
    }

    // Common method to capture screenshots
    public async captureScreenshot(screenshotName: string, fullPage: boolean = false) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await this.page.screenshot({
            path: `screenshots/${screenshotName}-${timestamp}.png`,
            fullPage,
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

    // Common method to get text content
    protected async getTextContent(locator: Locator): Promise<string | null> {
        return await locator.textContent();
    }
}
