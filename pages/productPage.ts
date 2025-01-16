import { Page } from '@playwright/test';
import BasePage from './basePage';

export default class ProductPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToCategory(categoryUrl: string) {
        await this.navigate(categoryUrl);
    }

    async clickProductLink(productName: string) {
        await this.page.getByRole('link', { name: productName }).first().click();
    }

    async verifyOldPrice(productId: string, price: string) {
        // Updated selector to be more specific
        const oldPriceSelector = `#product-${productId} del:has-text("${price}")`;
        await this.verifyElementVisible(oldPriceSelector);
        await this.verifyText(oldPriceSelector, price);
    }

    async verifyNewPrice(productId: string, price: string) {
        // Updated selector to be more specific
        const newPriceSelector = `#product-${productId} .price ins:has-text("${price}")`;
        await this.verifyElementVisible(newPriceSelector);
        await this.verifyText(newPriceSelector, price);
    }

    async verifySaleBadge() {
        const saleBadgeSelector = '.onsale:has-text("Sale!")';
        await this.verifyElementVisible(saleBadgeSelector);
    }
}