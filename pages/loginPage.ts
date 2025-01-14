import { Page } from "@playwright/test";

// A Page Object Model page for login flow

export default class LoginPage {
    constructor(public page: Page) {}

    async enterUsername(username: string) {
        await this.page.locator('#username-92')
        .type(username);
    }

    async enterPassword(passowrd: string) {
        await this.page.locator('#user_password-92')
        .type(passowrd);
    }

    async clickLoginBtn() {
        await this.page.locator('#um-submit-btn').click()
    }

}