import test, { expect } from "@playwright/test"
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

// Function to register user
async function registerUser(page) {
    const register = new RegisterPage(page);
    const fakeData = generateFakeData();
    await register.registerUser(fakeData.username, fakeData.firstName, fakeData.lastName, fakeData.email, fakeData.password);
}

test.use({storageState: "./NoAuth.json"})

test('Register user random data @Registration @Regression', async ({ page }) => {
    await page.goto('https://ovcharski.com/shop/register/')
    await registerUser(page);

    await expect(page).toHaveTitle('User – Automation Demo Site');
    await page.close();
})


