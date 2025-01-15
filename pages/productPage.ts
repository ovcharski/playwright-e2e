import { expect, Page } from '@playwright/test';

export default class ProductPage {
  constructor(public page: Page) {}

  async navigateToCategory(categoryUrl: string) {
    await this.page.goto(categoryUrl);
  }

  async clickProductLink(productName: string) {
    await this.page.getByRole('link', { name: productName }).first().click();
  }

  async verifyOldPrice(productId: string, price: string) {
    const oldPriceLocator = this.page.locator(`#product-${productId} del`).getByText(price).first();
    await expect(oldPriceLocator).toBeVisible();
  }

  async verifyNewPrice(productId: string, price: string) {
    const newPriceLocator = this.page.locator(`#product-${productId}`).getByText(price).first();
    await expect(newPriceLocator).toBeVisible();
  }

  async verifySaleBadge() {
    const saleBadgeLocator = this.page.getByText('Sale!').first();
    await expect(saleBadgeLocator).toBeVisible();
  }
}