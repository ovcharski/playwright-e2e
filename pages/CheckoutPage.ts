import { expect, Page, Request } from '@playwright/test';
import BasePage from './BasePage';
import { TIMEOUTS } from '../constants/timeouts';
import type { BillingInfo } from '../helpers/test-data';

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

    async fillCheckoutForm(billingInfo: BillingInfo) {
        // Set country first — WooCommerce refreshes shipping methods via AJAX
        // when the country changes. It is the one field located by id: the
        // site's dropdown widget hides the real <select> and gives its own
        // replacement the same "Country / Region" label, so the label matches
        // both.
        await this.page.locator('#billing_country').selectOption(billingInfo.country);

        // Scoped to the billing section: the page also holds a hidden shipping
        // form whose fields carry the same labels.
        const billing = this.page.locator('.woocommerce-billing-fields');

        await billing.getByLabel('First name').fill(billingInfo.firstname);
        await billing.getByLabel('Last name').fill(billingInfo.lastname);
        await billing.getByLabel('Company name').fill(billingInfo.company);
        await billing.getByLabel('Street address').fill(billingInfo.streetaddress);
        await billing.getByLabel('Apartment, suite, unit, etc.').fill(billingInfo.apaddress);
        await billing.getByLabel('Town / City').fill(billingInfo.towncity);
        await billing.getByLabel('Postcode / ZIP').fill(billingInfo.postcode);
        await billing.getByLabel('Phone').fill(billingInfo.phone);
        await billing.getByLabel('Email address').fill(billingInfo.email);

        // Wait for every update the fields above triggered to land, so the
        // payment section is not re-rendered while the card is being typed in.
        // Checking .blockUI alone races: the overlay may not have appeared yet.
        await expect.poll(() => this.pendingCheckoutUpdates).toBe(0);
        await expect(this.page.locator('.blockUI')).toHaveCount(0);
    }

    async selectCashOnDelivery() {
        await this.page.getByText('Cash on delivery').click();
    }

    // .check() rather than .click(): the radio is already selected, so this
    // stays a no-op and cannot fire a stray update_checkout AJAX before
    // #place_order.
    async selectCardPayment() {
        await this.page.getByRole('radio', { name: 'Payment options' }).check();
    }

    async placeOrder() {
        await this.page.locator('#place_order').click();
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

    // A server-side decline comes back as a WooCommerce checkout notice, not an
    // in-iframe validation error. The wording differs between Stripe ("Your
    // card was declined.") and the gateway's own copy ("The card was
    // declined."), so match the shared part.
    async expectOrderDeclined() {
        await expect(this.page.getByText(/card was declined/i)).toBeVisible();
        await expect(this.page).toHaveURL('checkout/');
    }

    async expectCardError(message: string) {
        // Wait for the iframe to be visible
        const iframeLocator = this.stripeCardFrame();
        await iframeLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.IFRAME_LOAD });

        // Switch to the iframe and verify the error message
        const cardFrame = iframeLocator.contentFrame();

        // Use regex to handle potential character encoding issues with apostrophes
        const messageRegex = new RegExp(message.replaceAll("'", String.raw`['\u2019]`), 'i');
        const errorLocator = cardFrame.getByText(messageRegex);
        await expect(errorLocator).toBeVisible({ timeout: TIMEOUTS.ERROR_MESSAGE });
    }
}
