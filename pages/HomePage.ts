import { expect } from '@playwright/test';
import BasePage from './BasePage';

export default class HomePage extends BasePage {
    async verifyWelcomeText(expectedText: string) {
        await expect(this.page.getByText(expectedText, { exact: true })).toBeVisible();
    }

    // toContainText ignores differences in whitespace, which the footer has
    // plenty of between its text, link and icons.
    async verifyFooterText(expectedText: string) {
        await expect(this.page.locator('.site-info')).toContainText(expectedText);
    }

    async captureHomePageScreenshot(screenshotName: string) {
        await this.captureScreenshot(screenshotName);
    }

    async captureFullPageScreenshot(screenshotName: string) {
        await this.captureScreenshot(`${screenshotName}-full`, true);
    }
}
