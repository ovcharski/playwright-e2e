import { expect, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class CartPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async addToCart() {
        await this.clickElement(this.page.getByRole('button', { name: 'Add to cart', exact: true }));
    }

    // Scoped to #content because the header cart widget exposes a "View cart"
    // link of its own.
    async viewCart() {
        await this.clickElement(this.page.locator('#content').getByRole('link', { name: 'View cart' }));
        await expect(this.page).toHaveURL('cart/');
    }

    async proceedToCheckout() {
        await this.clickElement(this.page.getByRole('link', { name: 'Proceed to checkout' }));
        await expect(this.page).toHaveURL('checkout/');
    }
}
