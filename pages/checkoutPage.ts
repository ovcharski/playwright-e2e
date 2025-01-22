import { Page } from "@playwright/test";
import BasePage from "./BasePage";

export default class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async fillCheckoutForm(firstname: string, lastname: string, company: string, 
                          streetaddress: string, apaddress: string, towncity: string, 
                          postcode: string, phone: string, email: string) {
        const fields = {
            '#billing_first_name': firstname,
            '#billing_last_name': lastname,
            '#billing_company': company,
            '#billing_address_1': streetaddress,
            '#billing_address_2': apaddress,
            '#billing_city': towncity,
            '#billing_postcode': postcode,
            '#billing_phone': phone,
            '#billing_email': email
        };

        await this.fillForm(fields);
    }

    async placeOrder() {
        await this.clickElement('#place_order');
    }
}