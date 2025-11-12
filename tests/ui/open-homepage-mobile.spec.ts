// tests/homepage.spec.ts
import { test, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage';

test.describe('Galaxy S10 viewport', () => {
    test.use({ viewport: { width: 360, height: 760 } });

    test('Open Homepage Mobile', async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to homepage
        await page.goto('/shop/');

        // Verify text on the homepage
        await homePage.verifyWelcomeText('Welcome to the store');

        // Capture screenshots
        await homePage.captureScreenshot('screenshot-s10');
        await homePage.captureFullPageScreenshot('screenshot-s10');
    });
});

test.describe('Galaxy S20 viewport', () => {
    test.use({ viewport: { width: 360, height: 800 } });

    test('Open Homepage Mobile', async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to homepage
        await page.goto('/shop/');

        // Verify text on the homepage
        await homePage.verifyWelcomeText('Welcome to the store');

        // Verify additional links visible on the page
        await expect(page.getByRole('link', { name: ' My Account' })).toBeVisible();
        await expect(page.getByRole('link', { name: ' Cart' })).toBeVisible();

        // Capture screenshots
        await homePage.captureScreenshot('screenshot-s20');
        await homePage.captureFullPageScreenshot('screenshot-s20');
    });
});

test.describe('Galaxy S20 Ultra viewport', () => {
    test.use({ viewport: { width: 412, height: 915 } });

    test('Open Homepage Mobile', async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to homepage
        await page.goto('/shop/');

        // Verify text on the homepage
        await homePage.verifyWelcomeText('Welcome to the store');

        // Verify additional links visible on the page
        await expect(page.getByRole('link', { name: ' My Account' })).toBeVisible();
        await expect(page.getByRole('link', { name: ' Cart' })).toBeVisible();

        // Capture screenshots
        await homePage.captureScreenshot('screenshot-s20-ultra');
        await homePage.captureFullPageScreenshot('screenshot-s20-ultra');
    });
});

test.describe('Galaxy iPhone SE 2 viewport', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('Open Homepage Mobile', async ({ page }) => {
        const homePage = new HomePage(page);

        // Go to homepage
        await page.goto('/shop/');

        // Verify text on the homepage
        await homePage.verifyWelcomeText('Welcome to the store');

        // Verify additional links visible on the page
        await expect(page.getByRole('link', { name: ' My Account' })).toBeVisible();
        await expect(page.getByRole('link', { name: ' Cart' })).toBeVisible();

        // Capture screenshots
        await homePage.captureScreenshot('screenshot-SE');
        await homePage.captureFullPageScreenshot('screenshot-SE');
    });
});
