import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly selectors = {
        username: '#username-92',
        password: '#user_password-92',
        loginButton: '#um-submit-btn',
    };

    async login(username: string, password: string) {
        const fields = {
            [this.selectors.username]: username,
            [this.selectors.password]: password,
        };

        await this.fillForm(fields);
        await this.clickElement(this.page.locator(this.selectors.loginButton));
    }

    async logout() {
        await this.clickElement(this.page.locator('#menu-item-130').getByRole('link', { name: 'Login' }));
        await this.clickElement(this.page.locator('#post-96').getByRole('link', { name: 'Logout' }));
    }
}
