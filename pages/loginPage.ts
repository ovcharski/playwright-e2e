import { Page } from "@playwright/test";

export default class LoginPage {
    constructor(public page: Page) {}

    // Combine login steps into a single method
    async login(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginBtn();
    }

    private async enterUsername(username: string) {
        const usernameInput = this.page.locator('#username-92');
        await usernameInput.type(username, { delay: 100 }); // Optional: Add a typing delay if needed
    }

    private async enterPassword(password: string) {
        const passwordInput = this.page.locator('#user_password-92');
        await passwordInput.type(password, { delay: 100 }); // Optional: Add a typing delay if needed
    }

    private async clickLoginBtn() {
        const loginBtn = this.page.locator('#um-submit-btn');
        await loginBtn.click();
    }
}