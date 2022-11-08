import test from "@playwright/test"
import LoginPage from "../pages/loginPage"

const username = 'rtclxbrg'
const password = 'U.^>hE~L(9J='

test('Login test', async ({ page }) => {



const login = new LoginPage(page);
await page.goto('https://ovcharski.com/shop/login/')
await login.enterUsername('playwrightuser');
await login.enterPassword('playwrightuser');
await login.clickLoginBtn();

})

