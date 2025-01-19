import { test, expect } from '@playwright/test';
import ProductPage from "../pages/productPage";

test('Check prices of products', async ({ page }) => {
    const productPage = new ProductPage(page);
    
    // Jenkins Beekeeper Jenkins
    await productPage.navigateToCategory('/shop/product-category/jenkins-artwork/');
    await productPage.clickProductLink('Jenkins Beekeeper Jenkins');
    await expect(page).toHaveURL(/jenkins-beekeeper/);
    await productPage.verifyOldPrice('122', '20,00 лв');
    await productPage.verifyNewPrice('122', '15,99 лв');
    
    // Jenkins Magician
    await productPage.navigateToCategory('/shop/product-category/jenkins-artwork/');
    await productPage.clickProductLink('Jenkins Magician');
    await expect(page).toHaveURL(/jenkins-magician/);
    // await productPage.verifySaleBadge();
    await productPage.verifyOldPrice('104', '20,00 лв');
    await productPage.verifyNewPrice('104', '9,99 лв');
    
    await page.close();
});