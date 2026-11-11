import { test as base } from '@playwright/test';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterPage from '../pages/RegisterPage';

// Fixtures are how Playwright Test hands a test what it needs. A test asks for
// one by naming it in its arguments, e.g. `async ({ page, loginPage }) => {}`,
// and Playwright builds it just for that test. A fixture nobody asks for is
// never built, so setup only runs where it is used.
//
// Specs import `test` and `expect` from this file instead of @playwright/test.
// https://playwright.dev/docs/test-fixtures

type Fixtures = {
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    homePage: HomePage;
    loginPage: LoginPage;
    productPage: ProductPage;
    profilePage: ProfilePage;
    registerPage: RegisterPage;
    checkoutWithProduct: CheckoutPage;
};

export const test = base.extend<Fixtures>({
    // One fixture per page object, replacing `new XPage(page)` in every spec.
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },

    // A CheckoutPage that is already on the checkout page with one Hat in the
    // cart. It depends on checkoutPage so that page object exists before the
    // checkout loads: its constructor starts counting the checkout's
    // background requests.
    checkoutWithProduct: async ({ page, productPage, cartPage, checkoutPage }, use) => {
        await page.goto('');
        await productPage.openShop();
        await productPage.clickProductLink('Hat');
        await cartPage.addToCart();
        await cartPage.viewCart();
        await cartPage.proceedToCheckout();

        await use(checkoutPage);
    },
});

export { expect } from '@playwright/test';
