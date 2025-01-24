import test, { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import RegisterPage from '../../pages/RegisterPage';

function generateFakeData() {
    return {
        username: faker.person.lastName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };
}

test.use({ storageState: './NoAuth.json' });

// Test using the combined registerUser method
test('Register user with combined method', async ({ page }) => {
    const fakeData = generateFakeData();
    const register = new RegisterPage(page);

    await page.goto('https://ovcharski.com/shop/register/');

    await register.registerUser(
        fakeData.username,
        fakeData.firstName,
        fakeData.lastName,
        fakeData.email,
        fakeData.password,
        'male', // optional parameter, defaults to 'male'
    );

    await expect(page).toHaveTitle('User – Automation Demo Site');
    await page.close();
});

// Test using separate steps
test('Register user with separate steps', async ({ page }) => {
    const fakeData = generateFakeData();
    const register = new RegisterPage(page);

    await page.goto('https://ovcharski.com/shop/register/');

    // Fill out the form
    await register.fillRegistrationForm(
        fakeData.username,
        fakeData.firstName,
        fakeData.lastName,
        fakeData.email,
        fakeData.password,
    );

    // Select gender explicitly
    await register.selectGender('male');

    // Click register button
    await register.clickRegisterBtn();

    await expect(page).toHaveTitle('User – Automation Demo Site');
    await page.close();
});

test.describe('Invalid Registration Scenarios', () => {
    let register: RegisterPage;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://ovcharski.com/shop/register/');
        register = new RegisterPage(page);
    });

    test('Should not register with invalid email format', async () => {
        const invalidData = {
            username: faker.person.lastName(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: 'invalid-email-format',
            password: faker.internet.password(),
        };

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
        const invalidData = {
            username: faker.person.lastName(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: '123', // Too short password
        };

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
        const invalidData = {
            username: 'playwrightuser', // Known existing username
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

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