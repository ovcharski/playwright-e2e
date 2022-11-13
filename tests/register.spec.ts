import test, { expect } from "@playwright/test"
import RegisterPage from "../pages/registerPage"

test('Register user test', async ({ page }) => {

const register = new RegisterPage(page);
await page.goto('https://ovcharski.com/shop/register/')
await register.enterUsername('testuser')
await register.enterFirstName('Ime')
await register.enterLastName('Familiya')
await register.enterEmail('test@test.bg')
await register.enterPassword('password123QWERTY!')
await register.enterConfirmPassword('password123QWERTY!')
await register.selectGender() // Male
await register.clickRegisterBtn()



})


