import test, { expect } from "@playwright/test";
import { faker } from '@faker-js/faker';
import RegisterPage from "../pages/registerPage";

// Function to generate fake data
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

test('Register user with random data @Registration @Regression', async ({ page }) => {
    const fakeData = generateFakeData();
    
    const register = new RegisterPage(page);
    
    // Go to the registration page
    await page.goto('https://ovcharski.com/shop/register/');

    // Register the user
    await register.registerUser(fakeData.username, fakeData.firstName, fakeData.lastName, fakeData.email, fakeData.password);

    // Wait for successful registration
    await expect(page).toHaveTitle('User – Automation Demo Site');
    await page.close();
});