import { Page } from '@playwright/test';
import BasePage from './BasePage';
import { TIMEOUTS } from '../constants/timeouts';

export default class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly selectors = {
        welcomeText: 'text=Welcome to the store',
        footerText: '.site-info', // Updated to use class selector instead of text
    };

    async verifyWelcomeText(expectedText: string) {
        const welcomeLocator = this.page.locator(this.selectors.welcomeText);
        await this.verifyElementVisible(welcomeLocator);
        await this.verifyText(welcomeLocator, expectedText, true);
    }

    async verifyFooterText(expectedText: string) {
        await this.verifyTextWithOptions(this.page.locator(this.selectors.footerText), expectedText, {
            normalizeWhitespace: true,
            timeout: TIMEOUTS.SHORT,
        });
    }

    async captureHomePageScreenshot(screenshotName: string) {
        await this.captureScreenshot(screenshotName);
    }

    async captureFullPageScreenshot(screenshotName: string) {
        await this.captureScreenshot(screenshotName, true);
    }
}
