import test, { expect } from '@playwright/test';
import CartPage from '../../pages/CartPage';
import CheckoutPage from '../../pages/CheckoutPage';
import ProductPage from '../../pages/ProductPage';
import { buildBillingInfo } from '../../helpers/test-data';

// Test Configuration
test.use({ storageState: './NoAuth.json' });

// Test Suite
test('Make an order', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Navigate to homepage and browse to Jenkins Artwork category
    await page.goto('');
    await productPage.openCategory('Jenkins Artwork');
    await expect(page).toHaveURL('product-category/jenkins-artwork/');

    // Select Jenkins Cosmonaut product
    await productPage.clickProductLink('Jenkins Cosmonaut');
    await expect(page).toHaveURL('product/jenkins-cosmonaut/');

    // Add product to cart and proceed to checkout
    await cart.addToCart();
    await cart.viewCart();
    await cart.proceedToCheckout();

    // Fill checkout form and select payment method
    await checkout.fillCheckoutForm(buildBillingInfo());
    await checkout.selectCashOnDelivery();
    await checkout.placeOrder();

    // Verify order confirmation
    await checkout.expectOrderReceived();
});

test('Make an order via search', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Search for product
    await page.goto('');
    await productPage.searchForProduct('Jenkinstein');
    await expect(page).toHaveURL('product/jenkins-jenkinstein/');

    // Add product to cart and proceed to checkout
    await cart.addToCart();
    await cart.viewCart();
    await cart.proceedToCheckout();

    // Fill checkout form and complete order
    await checkout.fillCheckoutForm(buildBillingInfo());
    await checkout.selectCashOnDelivery();
    await checkout.placeOrder();

    // Verify order confirmation
    await checkout.expectOrderReceived();
});
