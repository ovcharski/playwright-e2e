import { expect, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async fillCheckoutForm(billingInfo: {
        firstname: string;
        lastname: string;
        company: string;
        streetaddress: string;
        apaddress: string;
        towncity: string;
        postcode: string;
        phone: string;
        email: string;
    }) {
        const fields = {
            '#billing_first_name': billingInfo.firstname,
            '#billing_last_name': billingInfo.lastname,
            '#billing_company': billingInfo.company,
            '#billing_address_1': billingInfo.streetaddress,
            '#billing_address_2': billingInfo.apaddress,
            '#billing_city': billingInfo.towncity,
            '#billing_postcode': billingInfo.postcode,
            '#billing_phone': billingInfo.phone,
            '#billing_email': billingInfo.email,
        };

        await this.fillForm(fields);
    }

    async placeOrder() {
        await this.clickElement(this.page.locator('#place_order'));
    }

    async fillCardDetails(cardNumber: string, expiryDate: string, cvc: string) {
        // Wait for the iframe to be visible
        const iframeLocator = this.page.locator('iframe[name*="__privateStripeFrame"]').first();
        await iframeLocator.waitFor({ state: 'visible', timeout: 50000 });

        // Switch to the iframe and fill card details
        const cardFrame = iframeLocator.contentFrame();
        await cardFrame?.getByPlaceholder('1234 1234 1234 1234').fill(cardNumber);
        await cardFrame?.getByPlaceholder('MM / YY').fill(expiryDate);
        await cardFrame?.getByPlaceholder('CVC').fill(cvc);

        // Blur the CVC field to trigger validation
        await cardFrame?.getByPlaceholder('CVC').blur();
    }

    async expectOrderReceived() {
        await expect(this.page.getByRole('heading', { name: 'Order received' })).toBeVisible();
        await expect(this.page.getByText('Thank you. Your order has been received.')).toBeVisible();
    }

    async expectCardError(message: string) {
        // Wait for the iframe to be visible
        const iframeLocator = this.page.locator('iframe[name*="__privateStripeFrame"]').first();
        await iframeLocator.waitFor({ state: 'visible', timeout: 50000 });

        // Switch to the iframe and verify the error message
        const cardFrame = iframeLocator.contentFrame();

        // Wait for validation to trigger and error to appear after blur
        await this.page.waitForTimeout(2000);

        // Use regex to handle potential character encoding issues with apostrophes
        const messageRegex = new RegExp(message.replaceAll("'", "['\u2019]"), 'i');
        const errorLocator = cardFrame?.getByText(messageRegex);
        await expect(errorLocator).toBeVisible({ timeout: 15000 });
    }
}