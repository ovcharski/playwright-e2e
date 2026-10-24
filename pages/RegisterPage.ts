import { expect, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class RegisterPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Ultimate Member suffixes field ids with the form's post ID (-91 today),
    // which changes if the form is rebuilt, so match on the prefix.
    private readonly selectors = {
        username: 'input[id^="user_login-"]',
        firstName: 'input[id^="first_name-"]',
        lastName: 'input[id^="last_name-"]',
        email: 'input[id^="user_email-"]',
        password: 'input[id^="user_password-"]',
        confirmPassword: 'input[id^="confirm_user_password-"]',
        // genderMale: 'label:has-text("Male") i.um-icon-android-radio-button-off',
        // genderFemale: 'label:has-text("Female") i.um-icon-android-radio-button-off',
        registerButton: '#um-submit-btn',
    };

    private readonly errorSelectors = {
        // formError: '.um-field-error',
        usernameError: '[id^="um-error-for-user_login-"]',
        emailError: '[id^="um-error-for-user_email-"]',
        passwordError: '[id^="um-error-for-user_password-"]',
        confirmPasswordError: '[id^="um-error-for-confirm_user_password-"]',
    };

    // Method to fill form fields
    async fillRegistrationForm(username: string, firstname: string, lastname: string, email: string, password: string) {
        const fields = {
            [this.selectors.username]: username,
            [this.selectors.firstName]: firstname,
            [this.selectors.lastName]: lastname,
            [this.selectors.email]: email,
            [this.selectors.password]: password,
            [this.selectors.confirmPassword]: password,
        };

        await this.fillForm(fields);
    }

    // Public method to select gender
    async selectGender(gender: 'male' | 'female' = 'male') {
        const genderLocator =
            gender.toLowerCase() === 'male'
                ? this.page
                      .locator('label')
                      .filter({ hasText: /^Male$/ })
                      .locator('i')
                : this.page
                      .locator('label')
                      .filter({ hasText: /^Female$/ })
                      .locator('i');

        // Wait for the gender element to be visible
        await genderLocator.waitFor({ state: 'visible' });
        await genderLocator.click();
    }

    // Public method to click register button
    async clickRegisterBtn() {
        await this.clickElement(this.page.locator(this.selectors.registerButton));
    }

    // Method that combines all steps
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

    // Method to verify error message
    async verifyErrorMessage(field: keyof typeof this.errorSelectors, expectedMessage: string) {
        const errorLocator = this.page.locator(this.errorSelectors[field]);
        await this.verifyElementVisible(errorLocator);
        await this.verifyText(errorLocator, expectedMessage);
    }

    // Method to verify form submission blocked
    async verifyFormSubmissionBlocked() {
        // Check if we're still on the registration page
        await expect(this.page).toHaveURL(/.*\/register\//);
    }
}
