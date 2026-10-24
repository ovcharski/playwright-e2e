import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Ultimate Member suffixes field ids with the form's post ID (-92 today),
    // which changes if the form is rebuilt, so match on the prefix.
    private readonly selectors = {
        username: 'input[id^="username-"]',
        password: 'input[id^="user_password-"]',
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
        await this.clickElement(
            this.page.locator('.primary-navigation').getByRole('link', { name: 'Login', exact: true }),
        );
        await this.clickElement(this.page.getByRole('main').getByRole('link', { name: 'Logout' }));
    }
}
