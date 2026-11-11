import { expect } from '@playwright/test';
import BasePage from './BasePage';

export default class RegisterPage extends BasePage {
    // The error elements have no accessible name to locate them by. Ultimate
    // Member suffixes their ids with the form's post ID (-91 today), which
    // changes if the form is rebuilt, so match on the prefix.
    private readonly errorSelectors = {
        usernameError: '[id^="um-error-for-user_login-"]',
        emailError: '[id^="um-error-for-user_email-"]',
        passwordError: '[id^="um-error-for-user_password-"]',
        confirmPasswordError: '[id^="um-error-for-confirm_user_password-"]',
    };

    // exact: true where one label contains another ("Password" is also part
    // of "Confirm Password").
    async fillRegistrationForm(username: string, firstname: string, lastname: string, email: string, password: string) {
        await this.page.getByLabel('Username', { exact: true }).fill(username);
        await this.page.getByLabel('First Name').fill(firstname);
        await this.page.getByLabel('Last Name').fill(lastname);
        await this.page.getByLabel('E-mail Address').fill(email);
        await this.page.getByLabel('Password', { exact: true }).fill(password);
        await this.page.getByLabel('Confirm Password').fill(password);
    }

    async selectGender(gender: 'male' | 'female' = 'male') {
        const label = gender === 'male' ? /^Male$/ : /^Female$/;
        await this.page.locator('label').filter({ hasText: label }).locator('i').click();
    }

    async clickRegisterBtn() {
        await this.page.getByRole('button', { name: 'Register' }).click();
    }

    // Combines all the steps above
    async registerUser(
        username: string,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        gender: 'male' | 'female' = 'male',
    ) {
        await this.fillRegistrationForm(username, firstname, lastname, email, password);
        await this.selectGender(gender);
        await this.clickRegisterBtn();
    }

    async verifyErrorMessage(field: keyof typeof this.errorSelectors, expectedMessage: string) {
        await expect(this.page.locator(this.errorSelectors[field])).toContainText(expectedMessage);
    }

    // The form was rejected if we are still on the registration page
    async verifyFormSubmissionBlocked() {
        await expect(this.page).toHaveURL(/.*\/register\//);
    }
}
