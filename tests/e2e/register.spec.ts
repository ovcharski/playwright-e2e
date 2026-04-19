import test, { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import RegisterPage from '../../pages/RegisterPage';
import { buildRegistrationUser } from '../../helpers/test-data';

test.use({ storageState: './NoAuth.json' });

test('Register user', async ({ page }) => {
    const fakeData = buildRegistrationUser();
    const register = new RegisterPage(page);

    await page.goto('register/');

    await register.registerUser(
        fakeData.username,
        fakeData.firstName,
        fakeData.lastName,
        fakeData.email,
        fakeData.password,
        'male', // optional parameter, defaults to 'male'
    );

    await expect(page).toHaveTitle('User – Automation Demo Site');
});

test.describe('Invalid Registration Scenarios', () => {
    let register: RegisterPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('register/');
        register = new RegisterPage(page);
    });

    test('Should not register with invalid email format', async () => {
        const invalidData = buildRegistrationUser({ email: 'invalid-email-format' });

        await register.registerUser(
            invalidData.username,
            invalidData.firstName,
            invalidData.lastName,
            invalidData.email,
            invalidData.password,
        );

        await register.verifyErrorMessage('emailError', 'The email you entered is incorrect');
        await register.verifyFormSubmissionBlocked();
    });

    test('Should not register with short password', async () => {
        const invalidData = buildRegistrationUser({ password: '123' }); // Too short password

        await register.registerUser(
            invalidData.username,
            invalidData.firstName,
            invalidData.lastName,
            invalidData.email,
            invalidData.password,
        );

        await register.verifyErrorMessage('passwordError', 'Your Password must contain at least 8 characters');
        await register.verifyFormSubmissionBlocked();
    });

    test('should not register with existing username', async () => {
        const invalidData = buildRegistrationUser({ username: 'playwrightuser' }); // Known existing username

        await register.registerUser(
            invalidData.username,
            invalidData.firstName,
            invalidData.lastName,
            invalidData.email,
            invalidData.password,
        );

        await register.verifyErrorMessage('usernameError', 'The username you entered is incorrect');
        await register.verifyFormSubmissionBlocked();
    });

    test('should not register with empty required fields', async () => {
        // Only fill in some fields, leaving others empty
        await register.fillRegistrationForm(
            '', // empty username
            faker.person.firstName(),
            faker.person.lastName(),
            '', // empty email
            faker.internet.password(),
        );

        await register.selectGender('male');
        await register.clickRegisterBtn();

        // Verify multiple error messages
        await register.verifyErrorMessage('usernameError', 'Username is required');
        await register.verifyErrorMessage('emailError', 'E-mail Address is required');
        await register.verifyFormSubmissionBlocked();
    });
});