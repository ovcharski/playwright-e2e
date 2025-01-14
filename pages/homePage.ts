// pages/homePage.ts
import { Page, Locator, expect } from '@playwright/test';

export default class HomePage {
  private page: Page;

  constructor(page: Page) {
    this.page = page; // Initialize the page
  }

  // Method to get the locator for the welcome text
  private get welcomeTextLocator(): Locator {
    return this.page.locator('text=Welcome to the store');
  }

  // Method to get the locator for the footer text
  private get footerTextLocator(): Locator {
    return this.page.locator('text=© Automation Demo Site 2025 Built with WooCommerce.');
  }

  // Method to verify the welcome text
  async verifyWelcomeText(expectedText: string) {
    await expect(this.welcomeTextLocator).toBeVisible();
    await expect(this.welcomeTextLocator).toHaveText(expectedText);
  }

  // Method to verify the footer text
  async verifyFooterText(expectedText: string) {
    await expect(this.footerTextLocator).toContainText(expectedText);
  }

  // Method to take a screenshot with a custom name
  async captureScreenshot(screenshotName: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `screenshots/${screenshotName}-${timestamp}.png`,
    });
  }

  // Method to capture a full-page screenshot
  async captureFullPageScreenshot(screenshotName: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `screenshots/${screenshotName}-full-${timestamp}.png`,
      fullPage: true,
    });
  }
}
