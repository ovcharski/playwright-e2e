import { expect, Page, Request } from '@playwright/test';
import BasePage from './BasePage';
import { TIMEOUTS } from '../constants/timeouts';

export default class CheckoutPage extends BasePage {
    // In-flight update_order_review requests. WooCommerce sends one whenever an
    // address field changes, and its response re-renders the payment section,
    // which remounts the Stripe iframe.
    private pendingCheckoutUpdates = 0;

    constructor(page: Page) {
        super(page);
        const isCheckoutUpdate = (request: Request) => request.url().includes('wc-ajax=update_order_review');
        const settle = (request: Request) => {
            if (isCheckoutUpdate(request)) this.pendingCheckoutUpdates--;
        };
        page.on('request', (request) => {
            if (isCheckoutUpdate(request)) this.pendingCheckoutUpdates++;
        });
        page.on('requestfinished', settle);
        page.on('requestfailed', settle);
    }

    async fillCheckoutForm(billingInfo: {
        firstname: string;
        lastname: string;
        company: string;
        country: string;
        streetaddress: string;
        apaddress: string;
        towncity: string;
        postcode: string;
        phone: string;
        email: string;
    }) {
        // Set country first — WooCommerce refreshes shipping methods via AJAX
        // when the country changes.
        await this.page.locator('#billing_country').selectOption(billingInfo.country);

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

        // Wait for every update the fields above triggered to land, so the
        // payment section is not re-rendered while the card is being typed in.
        // Checking .blockUI alone races: the overlay may not have appeared yet.
        await expect.poll(() => this.pendingCheckoutUpdates).toBe(0);
        await expect(this.page.locator('.blockUI')).toHaveCount(0);
    }

    async selectCashOnDelivery() {
        await this.clickElement(this.page.getByText('Cash on delivery'));
    }

    // .check() rather than .click(): the radio is already selected, so this
    // stays a no-op and cannot fire a stray update_checkout AJAX before
    // #place_order.
    async selectCardPayment() {
        await this.page.getByRole('radio', { name: 'Payment options' }).check();
    }

    async placeOrder() {
        await this.clickElement(this.page.locator('#place_order'));
    }

    async fillCardDetails(cardNumber: string, expiryDate: string, cvc: string) {
        // Wait for the iframe to be visible
        const iframeLocator = this.stripeCardFrame();
        await iframeLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.IFRAME_LOAD });

        // Switch to the iframe and fill card details
        const cardFrame = iframeLocator.contentFrame();
        await cardFrame.getByPlaceholder('1234 1234 1234 1234').fill(cardNumber);
        await cardFrame.getByPlaceholder('MM / YY').fill(expiryDate);
        await cardFrame.getByPlaceholder('CVC').fill(cvc);

        // Blur the CVC field to trigger validation
        await cardFrame.getByPlaceholder('CVC').blur();
    }

    // Stripe mounts hidden helper frames alongside the Payment Element, so
    // take the first visible one rather than the first in DOM order.
    private stripeCardFrame() {
        return this.page.locator('iframe[name*="__privateStripeFrame"]').filter({ visible: true }).first();
    }

    async expectOrderReceived() {
        await expect(this.page.getByRole('heading', { name: 'Order received' })).toBeVisible();
        await expect(this.page.getByText('Thank you. Your order has been received.')).toBeVisible();
    }

    async expectCardError(message: string) {
        // Wait for the iframe to be visible
        const iframeLocator = this.stripeCardFrame();
        await iframeLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.IFRAME_LOAD });

        // Switch to the iframe and verify the error message
        const cardFrame = iframeLocator.contentFrame();

        // Wait for validation to trigger and error to appear after blur
        // eslint-disable-next-line playwright/no-wait-for-timeout -- Stripe debounces validation inside the iframe; no DOM signal to await
        await this.page.waitForTimeout(2000);

        // Use regex to handle potential character encoding issues with apostrophes
        const messageRegex = new RegExp(message.replaceAll("'", String.raw`['\u2019]`), 'i');
        const errorLocator = cardFrame.getByText(messageRegex);
        await expect(errorLocator).toBeVisible({ timeout: TIMEOUTS.ERROR_MESSAGE });
    }
}