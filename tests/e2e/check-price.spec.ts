import { test, expect } from '@playwright/test';
import ProductPage from '../../pages/ProductPage';

const products = [
    { url: 'jenkins-actor', price: '20,00 €' },
    { url: 'jenkins-beekeeper', price: '15,99 €' },
    { url: 'jenkins-captain', price: '25,00 €' },
    { url: 'jenkins-cosmonaut', price: '20,00 €' },
    { url: 'jenkins-cowboy', price: '20,00 €' },
    { url: 'jenkins-fire', price: '33,00 €' },
    { url: 'jenkins-general', price: '22,00 €' },
    { url: 'jenkins-jenkinstein', price: '20,00 €' },
    { url: 'jenkins-magician', price: '9,99 €' },
    { url: 'jenkins-superhero', price: '30,00 €' },
];

// Flaky test

test('Navigate to 2 products and check their prices', async ({ page }) => {
    const productPage = new ProductPage(page);

    // Jenkins Beekeeper Jenkins
    await productPage.navigateToCategory('product-category/jenkins-artwork/');
    await productPage.clickProductLink('Jenkins Beekeeper Jenkins' );
    await expect(page).toHaveURL(/jenkins-beekeeper/);
    await productPage.verifyOldPrice('20,00 €');
    await productPage.verifyNewPrice('15,99 €');

    // Jenkins Magician
    await productPage.navigateToCategory('product-category/jenkins-artwork/');
    await productPage.clickProductLink('Jenkins Magician');
    await expect(page).toHaveURL(/jenkins-magician/);
    await productPage.verifyOldPrice('20,00 €');
    await productPage.verifyNewPrice('9,99 €');
});

test.describe('Product Price Verification', () => {
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
        productPage = new ProductPage(page);
    });

    products.forEach((product) => {
        test(`Verify price of ${product.url}`, async () => {
            await productPage.navigateToProduct(`product/${product.url}/`);
            await productPage.verifyPrice(product.price);
        });
    });
});
