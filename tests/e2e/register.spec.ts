import { test, expect } from '../../fixtures/test-fixtures';
import { faker } from '@faker-js/faker';
import { buildRegistrationUser } from '../../helpers/test-data';
import { testUser } from '../../helpers/test-user';

test.use({ storageState: './NoAuth.json' });

test('Register user', async ({ page, registerPage }) => {
    const fakeData = buildRegistrationUser();

    await page.goto('register/');

    await registerPage.registerUser(
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
    test.beforeEach(async ({ page }) => {
        await page.goto('register/');
    });

    test('Should not register with invalid email format', async ({ registerPage }) => {
        const invalidData = buildRegistrationUser({ email: 'invalid-email-format' });

        await registerPage.registerUser(
            invalidData.username,
            invalidData.firstName,
            invalidData.lastName,
            invalidData.email,
            invalidData.password,
        );

        await registerPage.verifyErrorMessage('emailError', 'This is not a valid email');
        await registerPage.verifyFormSubmissionBlocked();
    });

    test('Should not register with short password', async ({ registerPage }) => {
        const invalidData = buildRegistrationUser({ password: '123' }); // Too short password

        await registerPage.registerUser(
            invalidData.username,
            invalidData.firstName,
            invalidData.lastName,
            invalidData.email,
            invalidData.password,
        );

        await registerPage.verifyErrorMessage('passwordError', 'Your Password must contain at least 8 characters');
        await registerPage.verifyFormSubmissionBlocked();
    });

    test('Should not register with existing username', async ({ registerPage }) => {
        const invalidData = buildRegistrationUser({ username: testUser.username }); // Known existing username

        await registerPage.registerUser(
            invalidData.username,
            invalidData.firstName,
            invalidData.lastName,
            invalidData.email,
            invalidData.password,
        );

        await registerPage.verifyErrorMessage('usernameError', 'The username you entered is incorrect');
        await registerPage.verifyFormSubmissionBlocked();
    });

    test('Should not register with empty required fields', async ({ registerPage }) => {
        // Only fill in some fields, leaving others empty
        await registerPage.fillRegistrationForm(
            '', // empty username
            faker.person.firstName(),
            faker.person.lastName(),
            '', // empty email
            faker.internet.password(),
        );

        await registerPage.selectGender('male');
        await registerPage.clickRegisterBtn();

        // Verify multiple error messages
        await registerPage.verifyErrorMessage('usernameError', 'Username is required');
        await registerPage.verifyErrorMessage('emailError', 'E-mail Address is required');
        await registerPage.verifyFormSubmissionBlocked();
    });
});
