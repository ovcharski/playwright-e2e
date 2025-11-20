import { test, expect } from '@playwright/test';
import ProductPage from '../../pages/ProductPage';

const products = [
    { url: 'jenkins-actor', id: '124', price: '20,00 лв.' },
    { url: 'jenkins-beekeeper', id: '122', price: '15,99 лв.' },
    { url: 'jenkins-captain', id: '120', price: '25,00 лв.' },
    { url: 'jenkins-cosmonaut', id: '118', price: '20,00 лв.' },
    { url: 'jenkins-cowboy', id: '116', price: '20,00 лв.' },
    { url: 'jenkins-fire', id: '113', price: '33,00 лв.' },
    { url: 'jenkins-general', id: '111', price: '22,00 лв.' },
    { url: 'jenkins-jenkinstein', id: '109', price: '20,00 лв.' },
    { url: 'jenkins-magician', id: '104', price: '9,99 лв.' },
    { url: 'jenkins-superhero', id: '102', price: '30,00 лв.' },
];

// Flaky test

test('Navigate to 2 products and check their prices', async ({ page }) => {
    const productPage = new ProductPage(page);

    // Jenkins Beekeeper Jenkins
    await productPage.navigateToCategory('product-category/jenkins-artwork/');
    await productPage.clickProductLink('Jenkins Beekeeper Jenkins' );
    await expect(page).toHaveURL(/jenkins-beekeeper/);
    await productPage.verifyOldPrice('122', '20,00 лв');
    await productPage.verifyNewPrice('122', '15,99 лв');

    // Jenkins Magician
    await productPage.navigateToCategory('product-category/jenkins-artwork/');
    await productPage.clickProductLink('Jenkins Magician');
    await expect(page).toHaveURL(/jenkins-magician/);
    await productPage.verifyOldPrice('104', '20,00 лв');
    await productPage.verifyNewPrice('104', '9,99 лв');
});

test.describe('Product Price Verification', () => {
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
        productPage = new ProductPage(page);
    });

    test('Verify all product prices', async () => {
        for (const product of products) {
            await productPage.navigateToProduct(`product/${product.url}/`);
            await productPage.verifyPrice(product.id, product.price);
        }
    });
});
