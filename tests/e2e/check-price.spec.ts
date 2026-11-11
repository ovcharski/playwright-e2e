import { test, expect } from '../../fixtures/test-fixtures';

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

// Current prices come from the list above, so each one is written down once.
const priceOf = (url: string) => products.find((product) => product.url === url)!.price;

// The two products on sale show their regular price struck through next to
// the current one.
test('Navigate to 2 products and check their prices', async ({ page, productPage }) => {
    // Jenkins Beekeeper Jenkins
    await productPage.navigateToCategory('product-category/jenkins-artwork/');
    await productPage.clickProductLink('Jenkins Beekeeper Jenkins');
    await expect(page).toHaveURL(/jenkins-beekeeper/);
    await productPage.verifyOldPrice('20,00 €');
    await productPage.verifyNewPrice(priceOf('jenkins-beekeeper'));

    // Jenkins Magician
    await productPage.navigateToCategory('product-category/jenkins-artwork/');
    await productPage.clickProductLink('Jenkins Magician');
    await expect(page).toHaveURL(/jenkins-magician/);
    await productPage.verifyOldPrice('20,00 €');
    await productPage.verifyNewPrice(priceOf('jenkins-magician'));
});

test.describe('Product Price Verification', () => {
    products.forEach((product) => {
        test(`Verify price of ${product.url}`, async ({ productPage }) => {
            await productPage.navigateToProduct(`product/${product.url}/`);
            await productPage.verifyPrice(product.price);
        });
    });
});
