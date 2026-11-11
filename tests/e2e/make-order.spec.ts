import { test, expect } from '../../fixtures/test-fixtures';
import { buildBillingInfo } from '../../helpers/test-data';

// Test Configuration
test.use({ storageState: './NoAuth.json' });

// Test Suite
test('Make an order', async ({ page, productPage, cartPage, checkoutPage }) => {
    // Navigate to homepage and browse to Jenkins Artwork category
    await page.goto('');
    await productPage.openCategory('Jenkins Artwork');
    await expect(page).toHaveURL('product-category/jenkins-artwork/');

    // Select Jenkins Cosmonaut product
    await productPage.clickProductLink('Jenkins Cosmonaut');
    await expect(page).toHaveURL('product/jenkins-cosmonaut/');

    // Add product to cart and proceed to checkout
    await cartPage.addToCart();
    await cartPage.viewCart();
    await cartPage.proceedToCheckout();

    // Fill checkout form and select payment method
    await checkoutPage.fillCheckoutForm(buildBillingInfo());
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.placeOrder();

    // Verify order confirmation
    await checkoutPage.expectOrderReceived();
});

test('Make an order via search', async ({ page, productPage, cartPage, checkoutPage }) => {
    // Search for product
    await page.goto('');
    await productPage.searchAndOpenProduct('Jenkinstein', 'product/jenkins-jenkinstein/');
    await expect(page).toHaveURL('product/jenkins-jenkinstein/');

    // Add product to cart and proceed to checkout
    await cartPage.addToCart();
    await cartPage.viewCart();
    await cartPage.proceedToCheckout();

    // Fill checkout form and complete order
    await checkoutPage.fillCheckoutForm(buildBillingInfo());
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.placeOrder();

    // Verify order confirmation
    await checkoutPage.expectOrderReceived();
});
