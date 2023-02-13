import { Page } from "@playwright/test";

// A Page Object Model page for checkout flow

export default class checkoutPage {
    constructor(public page: Page) {}

    async firstName(firstname: string) {
        await this.page.locator('#billing_first_name')
        .type(firstname);
    }

    async lastName(lastname: string) {
        await this.page.locator('#billing_last_name')
        .type(lastname);
    }

    async companyName(company: string) {
        await this.page.getByRole('textbox', { name: 'Company name (optional)' })
        .type(company);
    }

    async streetAddress(steetaddress: string) {
        await this.page.getByRole('textbox', { name: 'Street address *' })
        .type(steetaddress);
    }

    async apAddress(apaddress: string) {
        await this.page.getByRole('textbox', { name: 'Apartment, suite, unit, etc. (optional)' })
        .type(apaddress);
    }

    async townCity(towncity: string) {
        await this.page.getByRole('textbox', { name: 'Town / City *' })
        .type(towncity);
    }

    async stateCounty() {
        await this.page.getByRole('textbox', { name: 'Sofia' }).click();
    }

    async postode(postcode: string) {
        await this.page.getByRole('textbox', { name: 'Postcode / ZIP *' })
        .type(postcode);
    }

    async phone(phonenumber: string) {
        await this.page.getByLabel('Phone *')
        .type(phonenumber);
    }

    async email(email: string) {
        await this.page.getByLabel('Email address *')
        .type(email);
    }

    async placeOrderBtn() {
        await this.page.getByRole('button', { name: 'Place order' }).click();
    }

}