import test, { expect } from "@playwright/test";
import { faker } from '@faker-js/faker';
import RegisterPage from "../pages/registerPage";

function generateFakeData() {
    return {
        username: faker.person.lastName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
}

test.use({ storageState: "./NoAuth.json" });

// Test using the combined registerUser method
test('Register user with combined method @Registration @Regression', async ({ page }) => {
    const fakeData = generateFakeData();
    const register = new RegisterPage(page);
    
    await page.goto('https://ovcharski.com/shop/register/');
    
    await register.registerUser(
        fakeData.username,
        fakeData.firstName,
        fakeData.lastName,
        fakeData.email,
        fakeData.password,
        'male' // optional parameter, defaults to 'male'
    );
    
    await expect(page).toHaveTitle('User – Automation Demo Site');
    await page.close();
});

// Test using separate steps
test('Register user with separate steps @Registration @Regression', async ({ page }) => {
    const fakeData = generateFakeData();
    const register = new RegisterPage(page);
    
    await page.goto('https://ovcharski.com/shop/register/');
    
    // Fill out the form
    await register.fillRegistrationForm(
        fakeData.username,
        fakeData.firstName,
        fakeData.lastName,
        fakeData.email,
        fakeData.password
    );
    
    // Select gender explicitly
    await register.selectGender('male');
    // await page.getByText('Male', { exact: true }).click();
    
    // Click register button
    await register.clickRegisterBtn();
    
    await expect(page).toHaveTitle('User – Automation Demo Site');
    await page.close();
});