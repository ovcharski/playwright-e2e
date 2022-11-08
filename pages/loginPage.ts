import { Page } from "@playwright/test";

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
        await this.page.locator('#um-submit-btn')
    }

    // getByRole('button', { name: 'Login' })
}