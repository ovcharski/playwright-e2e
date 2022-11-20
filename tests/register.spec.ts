import test, { expect } from "@playwright/test"
import { faker } from '@faker-js/faker';
import RegisterPage from "../pages/registerPage";

// Using FakerJS to generate fake data. Another option is ChanseJS https://chancejs.com/

const randomFirstName = faker.name.firstName()
const randomLastName = faker.name.lastName()
const randomEmail = faker.internet.email()
const randomPassword = faker.internet.password()


test('Register user random data @Registration @Regression', async ({ page }) => {

    const register = new RegisterPage(page)
    await page.goto('https://ovcharski.com/shop/register/')
    await register.enterUsername(randomLastName)
    await register.enterFirstName(randomFirstName)
    await register.enterLastName(randomLastName)
    await register.enterEmail(randomEmail)
    await register.enterPassword(randomPassword)
    await register.enterConfirmPassword(randomPassword)
    await register.selectGender() // Male
    await register.clickRegisterBtn()

    await expect(page).toHaveTitle('User – Automation Demo Site');

    })