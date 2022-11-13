import { Page } from "@playwright/test";

export default class RegisterPage {

    constructor(public page: Page) {
    }

    async enterUsername(username: string) {
        await this.page.locator('#user_login-91')
        .type(username);
    }

    async enterFirstName(firstname: string) {
        await this.page.locator('#first_name-91')
        .type(firstname);
    }

    async enterLastName(lastname: string) {
        await this.page.locator('#last_name-91')
        .type(lastname);
    }

    async enterEmail(email: string) {
        await this.page.locator('#user_email-91')
        .type(email);
    }

    async enterPassword(password: string) {
        await this.page.locator('#user_password-91')
        .type(password);
    }

    async selectGender() {
        await this.page.locator('i').first().click();
    }

    async enterConfirmPassword(password: string) {
        await this.page.locator('#confirm_user_password-91')
        .type(password);
    }

    async clickRegisterBtn() {
        await this.page.locator('#um-submit-btn').click()
    }
}