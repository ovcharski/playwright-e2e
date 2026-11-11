import BasePage from './BasePage';

export default class LoginPage extends BasePage {
    async login(username: string, password: string) {
        await this.page.getByLabel('Username or E-mail').fill(username);
        await this.page.getByLabel('Password').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async logout() {
        await this.page.locator('.primary-navigation').getByRole('link', { name: 'Login', exact: true }).click();
        await this.page.getByRole('main').getByRole('link', { name: 'Logout' }).click();
    }
}
