import { expect } from '@playwright/test';
import BasePage from './BasePage';

export default class CartPage extends BasePage {
    async addToCart() {
        await this.page.getByRole('button', { name: 'Add to cart', exact: true }).click();
    }

    // Scoped to #content because the header cart widget exposes a "View cart"
    // link of its own. Waits for the load event, not just the URL: until
    // WooCommerce's cart script has run, typing a quantity does not enable
    // the Update cart button.
    async viewCart() {
        await this.page.locator('#content').getByRole('link', { name: 'View cart' }).click();
        await this.page.waitForURL('cart/');
    }

    // Scoped to the cart form: the header cart widget lists the same products
    // with a "Remove … from cart" button of its own.
    productRow(productName: string) {
        return this.page
            .locator('form.woocommerce-cart-form')
            .getByRole('row', { name: `Remove ${productName} from cart` });
    }

    // Anchored at the start of the row name: "Total" alone also matches the
    // "Subtotal" row.
    totalsRow(label: 'Subtotal' | 'Total') {
        return this.page.locator('.cart_totals').getByRole('row', { name: new RegExp(`^${label}`) });
    }

    // Update cart reloads the table in the background. The notice is the
    // signal that the new quantities and totals are on the page.
    async setQuantity(productName: string, quantity: number) {
        await this.productRow(productName).getByRole('spinbutton', { name: 'Product quantity' }).fill(String(quantity));
        await this.page.getByRole('button', { name: 'Update cart' }).click();
        await expect(this.page.getByRole('alert').filter({ hasText: 'Cart updated.' })).toBeVisible();
    }

    async removeProduct(productName: string) {
        await this.productRow(productName)
            .getByRole('button', { name: `Remove ${productName} from cart` })
            .click();
    }

    async proceedToCheckout() {
        await this.page.getByRole('link', { name: 'Proceed to checkout' }).click();
        await expect(this.page).toHaveURL('checkout/');
    }
}
