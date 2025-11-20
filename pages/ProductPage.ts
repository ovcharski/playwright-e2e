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
        const priceSelector = `#product-${productId}`;
        await this.verifyElementVisible(priceSelector);
        await this.verifyText(priceSelector, expectedPrice);
    }

    async verifyOldPrice(productId: string, price: string) {
        const oldPriceSelector = `#product-${productId} del`;
        await this.verifyElementVisible(oldPriceSelector);
        await this.verifyText(oldPriceSelector, price);
    }

    async verifyNewPrice(productId: string, price: string) {
        const newPriceSelector = `#product-${productId} .price ins`;
        await this.verifyElementVisible(newPriceSelector);
        await this.verifyText(newPriceSelector, price);
    }

    async verifySaleBadge() {
        const saleBadgeSelector = '.onsale:has-text("Sale!")';
        await this.verifyElementVisible(saleBadgeSelector);
    }
}
