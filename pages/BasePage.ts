import { Page, test } from '@playwright/test';

// Page objects call the Playwright API directly; this base class only holds
// what every page genuinely shares.
export default abstract class BasePage {
    constructor(protected readonly page: Page) {}

    // Attaches the screenshot to the running test, so it shows up in the HTML
    // report (which CI uploads) instead of piling up in a local folder.
    async captureScreenshot(screenshotName: string, fullPage: boolean = false) {
        await test.info().attach(screenshotName, {
            body: await this.page.screenshot({ fullPage }),
            contentType: 'image/png',
        });
    }
}
