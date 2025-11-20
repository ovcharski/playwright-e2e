import { expect, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async fillCheckoutForm(
        firstname: string,
        lastname: string,
        company: string,
        streetaddress: string,
        apaddress: string,
        towncity: string,
        postcode: string,
        phone: string,
        email: string,
    ) {
        const fields = {
            '#billing_first_name': firstname,
            '#billing_last_name': lastname,
            '#billing_company': company,
            '#billing_address_1': streetaddress,
            '#billing_address_2': apaddress,
            '#billing_city': towncity,
            '#billing_postcode': postcode,
            '#billing_phone': phone,
            '#billing_email': email,
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
        const cardFrame = await iframeLocator.contentFrame();
        await cardFrame?.getByPlaceholder('1234 1234 1234 1234').fill(cardNumber);
        await cardFrame?.getByPlaceholder('MM / YY').fill(expiryDate);
        await cardFrame?.getByPlaceholder('CVC').fill(cvc);
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
        const cardFrame = await iframeLocator.contentFrame();
        await expect(cardFrame?.getByText(message)).toBeVisible();
    }
}