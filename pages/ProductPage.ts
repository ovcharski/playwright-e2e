import { expect } from '@playwright/test';
import BasePage from './BasePage';

export default class ProductPage extends BasePage {
    async navigateToCategory(categoryUrl: string) {
        await this.page.goto(categoryUrl);
    }

    async navigateToProduct(productUrl: string) {
        await this.page.goto(productUrl);
    }

    // Scoped to the product grid on purpose: the mini-cart widget links to
    // products by name too, and those links sit outside the viewport, so an
    // unscoped lookup can resolve to one and then fail to click it.
    async clickProductLink(productName: string) {
        await this.page.locator('ul.products').getByRole('link', { name: productName }).first().click();
    }

    // Top-level menu links only: the primary nav carries a second "Shop" link
    // inside its nested Pages submenu, so a role-based lookup matches two
    // elements. (Menu item ids would work too, but change if the menu is rebuilt.)
    async openShop() {
        await this.page
            .locator('.primary-navigation ul.menu > li > a')
            .filter({ hasText: /^Shop$/ })
            .click();
    }

    async openCategory(categoryName: string) {
        await this.page.getByLabel(`Visit product category ${categoryName}`).click();
    }

    async searchForProduct(query: string) {
        const searchBox = this.page.getByRole('searchbox', { name: 'Search for:' });
        await searchBox.fill(query);
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
            await this.page.locator(`ul.products a[href$="/${productPath}"]`).first().click();
        }
    }

    // Price lookups are scoped to the product's own .summary: the page also
    // shows a related-products grid, whose prices would otherwise match.
    async verifyPrice(expectedPrice: string) {
        await expect(this.page.locator('.summary .price')).toContainText(expectedPrice);
    }

    async verifyOldPrice(price: string) {
        await expect(this.page.locator('.summary .price del')).toContainText(price);
    }

    async verifyNewPrice(price: string) {
        await expect(this.page.locator('.summary .price ins')).toContainText(price);
    }
}
