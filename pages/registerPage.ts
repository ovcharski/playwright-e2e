import { Page } from "@playwright/test";
import BasePage from "./basePage";

export default class RegisterPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private readonly selectors = {
        username: '#user_login-91',
        firstName: '#first_name-91',
        lastName: '#last_name-91',
        email: '#user_email-91',
        password: '#user_password-91',
        confirmPassword: '#confirm_user_password-91',
        genderMale: 'label:has-text("Male") i.um-icon-android-radio-button-off',
        genderFemale: 'label:has-text("Female") i.um-icon-android-radio-button-off',
        registerButton: '#um-submit-btn'
    };

    // Method to fill form fields
    async fillRegistrationForm(username: string, firstname: string, lastname: string, email: string, password: string) {
        const fields = {
            [this.selectors.username]: username,
            [this.selectors.firstName]: firstname,
            [this.selectors.lastName]: lastname,
            [this.selectors.email]: email,
            [this.selectors.password]: password,
            [this.selectors.confirmPassword]: password
        };

        await this.fillForm(fields);
    }

    // Public method to select gender
    async selectGender(gender: 'male' | 'female' = 'male') {
        const selector = gender.toLowerCase() === 'male' 
            ? this.selectors.genderMale 
            : this.selectors.genderFemale;
        await this.clickElement(selector);
    }

    // Public method to click register button
    async clickRegisterBtn() {
        await this.clickElement(this.selectors.registerButton);
    }

    // Method that combines all steps
    async registerUser(username: string, firstname: string, lastname: string, email: string, password: string, gender: 'male' | 'female' = 'male') {
        await this.fillRegistrationForm(username, firstname, lastname, email, password);
        await this.selectGender(gender);
        await this.clickRegisterBtn();
    }
}