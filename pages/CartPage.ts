import { expect } from '@playwright/test';
import BasePage from './BasePage';

export default class CartPage extends BasePage {
    async addToCart() {
        await this.page.getByRole('button', { name: 'Add to cart', exact: true }).click();
    }

    // Scoped to #content because the header cart widget exposes a "View cart"
    // link of its own.
    async viewCart() {
        await this.page.locator('#content').getByRole('link', { name: 'View cart' }).click();
        await expect(this.page).toHaveURL('cart/');
    }

    async proceedToCheckout() {
        await this.page.getByRole('link', { name: 'Proceed to checkout' }).click();
        await expect(this.page).toHaveURL('checkout/');
    }
}
