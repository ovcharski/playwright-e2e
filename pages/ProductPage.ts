import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class ProductPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToCategory(categoryUrl: string) {
        await this.navigate(categoryUrl);
    }

    async navigateToProduct(productUrl: string) {
        await this.navigate(productUrl);
    }

    async clickProductLink(productName: string) {
        await this.page.getByRole('link', { name: productName }).first().click();
    }

    async verifyPrice(productId: string, expectedPrice: string) {
        const priceLocator = this.page.locator(`#product-${productId}`);
        await this.verifyElementVisible(priceLocator);
        await this.verifyText(priceLocator, expectedPrice);
    }

    async verifyOldPrice(productId: string, price: string) {
        const oldPriceLocator = this.page.locator(`#product-${productId} del`).first();
        await this.verifyElementVisible(oldPriceLocator);
        await this.verifyText(oldPriceLocator, price);
    }

    async verifyNewPrice(productId: string, price: string) {
        const newPriceLocator = this.page.locator(`#product-${productId} .price ins`).first();
        await this.verifyElementVisible(newPriceLocator);
        await this.verifyText(newPriceLocator, price);
    }

    async verifySaleBadge() {
        const saleBadgeLocator = this.page.locator('.onsale:has-text("Sale!")');
        await this.verifyElementVisible(saleBadgeLocator);
    }
}
