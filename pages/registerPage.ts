import { Page } from "@playwright/test";

export default class RegisterPage {

    constructor(public page: Page) {
    }

    private async typeIntoLocator(locator: string, value: string) {
        await this.page.locator(locator).type(value);
    }

    async enterUsername(username: string) {
        await this.typeIntoLocator('#user_login-91', username);
    }

    async enterFirstName(firstname: string) {
        await this.typeIntoLocator('#first_name-91', firstname);
    }

    async enterLastName(lastname: string) {
        await this.typeIntoLocator('#last_name-91', lastname);
    }

    async enterEmail(email: string) {
        await this.typeIntoLocator('#user_email-91', email);
    }

    async enterPassword(password: string) {
        await this.typeIntoLocator('#user_password-91', password);
    }

    async enterConfirmPassword(password: string) {
        await this.typeIntoLocator('#confirm_user_password-91', password);
    }

    async selectGender() {
        await this.page.locator('i').first().click();
    }

    async clickRegisterBtn() {
        await this.page.locator('#um-submit-btn').click()
    }

    async registerUser(username: string, firstname: string, lastname: string, email: string, password: string) {
        const fields = {
            '#user_login-91': username,
            '#first_name-91': firstname,
            '#last_name-91': lastname,
            '#user_email-91': email,
            '#user_password-91': password,
            '#confirm_user_password-91': password,
        };

        await this.fillOutForm(fields);
        await this.selectGender();
        await this.clickRegisterBtn();
    }

    private async fillOutForm(fields: { [key: string]: string }) {
        for (const [locator, value] of Object.entries(fields)) {
            await this.typeIntoLocator(locator, value);
        }
    }
}
