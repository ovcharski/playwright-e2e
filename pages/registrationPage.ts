import { Page } from "@playwright/test";
export default class RegistrationPage {

    constructor(public page: Page) {

    }


    async enterFirstName(firstname: string) {
        this.page.locator('input[name="first_name-91"]')
        .type(firstname);



}

}