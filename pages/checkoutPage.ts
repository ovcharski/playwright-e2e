import { Page } from "@playwright/test";

// A Page Object Model page for checkout flow
export default class CheckoutPage {
    constructor(public page: Page) {}

    private async typeIntoLocator(locator: string, value: string) {
        await this.page.locator(locator).type(value);
    }

    // Fill out fields
    async fillCheckoutForm(firstname: string, lastname: string, company: string, streetaddress: string, apaddress: string, towncity: string, postcode: string, phone: string, email: string) {
        await this.typeIntoLocator('#billing_first_name', firstname);
        await this.typeIntoLocator('#billing_last_name', lastname);
        await this.typeIntoLocator('#billing_company', company);
        await this.typeIntoLocator('#billing_address_1', streetaddress);
        await this.typeIntoLocator('#billing_address_2', apaddress);
        await this.typeIntoLocator('#billing_city', towncity);
        await this.typeIntoLocator('#billing_postcode', postcode);
        await this.page.locator('#billing_phone').type(phone);
        await this.page.locator('#billing_email').type(email);
    }

    // Click place order button
    async placeOrder() {
        await this.page.locator('#place_order').click();
    }
}