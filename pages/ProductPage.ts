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

    // Scoped to the product grid on purpose: the mini-cart widget links to
    // products by name too, and those links sit outside the viewport, so an
    // unscoped lookup can resolve to one and then fail to click it.
    async clickProductLink(productName: string) {
        await this.clickElement(this.page.locator('ul.products').getByRole('link', { name: productName }).first());
    }

    // Scoped to the menu item id on purpose: the primary nav carries a second
    // "Shop" link inside its nested Pages submenu, so a role-based lookup
    // matches two elements.
    async openShop() {
        await this.clickElement(this.page.locator('#menu-item-126').getByRole('link', { name: 'Shop' }));
    }

    async openCategory(categoryName: string) {
        await this.clickElement(this.page.getByLabel(`Visit product category ${categoryName}`));
    }

    async searchForProduct(query: string) {
        const searchBox = this.page.getByRole('searchbox', { name: 'Search for:' });
        await this.typeIntoLocator(searchBox, query);
        await searchBox.press('Enter');
    }

    // WooCommerce jumps straight to the product page when a search has exactly
    // one match and shows a results grid otherwise. Handle both, so a new
    // product that also matches the query does not break the test.
    async searchAndOpenProduct(query: string, productPath: string) {
        const isProductPage = (url: URL) => url.pathname.endsWith(`/${productPath}`);
        await this.searchForProduct(query);
        await this.page.waitForURL((url) => isProductPage(url) || url.searchParams.has('s'));
        if (!isProductPage(new URL(this.page.url()))) {
            await this.clickElement(this.page.locator(`ul.products a[href$="/${productPath}"]`).first());
        }
    }

    // Price lookups are scoped to the product's own .summary: #product-<id>
    // also wraps the related-products grid, whose prices would otherwise match.
    async verifyPrice(productId: string, expectedPrice: string) {
        const priceLocator = this.page.locator(`#product-${productId} .summary .price`);
        await this.verifyElementVisible(priceLocator);
        await this.verifyText(priceLocator, expectedPrice);
    }

    async verifyOldPrice(productId: string, price: string) {
        const oldPriceLocator = this.page.locator(`#product-${productId} .summary .price del`);
        await this.verifyElementVisible(oldPriceLocator);
        await this.verifyText(oldPriceLocator, price);
    }

    async verifyNewPrice(productId: string, price: string) {
        const newPriceLocator = this.page.locator(`#product-${productId} .summary .price ins`);
        await this.verifyElementVisible(newPriceLocator);
        await this.verifyText(newPriceLocator, price);
    }

    async verifySaleBadge() {
        const saleBadgeLocator = this.page.locator('.onsale:has-text("Sale!")');
        await this.verifyElementVisible(saleBadgeLocator);
    }
}
