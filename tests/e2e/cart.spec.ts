import { test, expect } from '../../fixtures/test-fixtures';

// Guest session: each test gets its own empty cart. The logged-in user's cart
// is stored on the server and would carry items over between runs.
test.use({ storageState: './NoAuth.json' });

test.describe('Cart', () => {
    test.beforeEach(async ({ productPage, cartPage }) => {
        await productPage.navigateToProduct('product/hat/');
        await cartPage.addToCart();
        await cartPage.viewCart();
    });

    test('Changing the quantity updates the line subtotal and the cart totals', async ({ cartPage }) => {
        await expect(cartPage.productRow('Hat').getByRole('cell').last()).toHaveText('12,00 €');
        await expect(cartPage.totalsRow('Total')).toContainText('12,00 €');

        await cartPage.setQuantity('Hat', 3);

        await expect(cartPage.productRow('Hat').getByRole('cell').last()).toHaveText('36,00 €');
        await expect(cartPage.totalsRow('Subtotal')).toContainText('36,00 €');
        await expect(cartPage.totalsRow('Total')).toContainText('36,00 €');
    });

    test('Removing the only product empties the cart', async ({ page, cartPage }) => {
        await cartPage.removeProduct('Hat');

        await expect(page.getByRole('alert').filter({ hasText: '“Hat” removed.' })).toBeVisible();
        await expect(page.getByText('Your cart is currently empty.')).toBeVisible();
        await expect(cartPage.productRow('Hat')).toHaveCount(0);
    });
});
