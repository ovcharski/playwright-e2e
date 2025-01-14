import test, { expect } from "@playwright/test";
import LoginPage from "../pages/loginPage";

// Declare user credentials and URL for better maintainability
const USERNAME = 'playwrightuser';
const PASSWORD = 'playwrightuser';
const LOGIN_URL = 'https://ovcharski.com/shop/login/';
const USER_PROFILE_URL = `https://ovcharski.com/shop/user/${USERNAME}/`;

test.use({ storageState: "./NoAuth.json" });

test('Login for Authentication test @Login @Regression', async ({ page }) => {
  const login = new LoginPage(page);

  // Go to the login page
  await page.goto(LOGIN_URL);

  // Perform login action
  await login.login(USERNAME, PASSWORD);

  // Validate title, URL, and profile details
  await expect(page).toHaveTitle('User – Automation Demo Site');
  await expect(page).toHaveURL(USER_PROFILE_URL);
  
  // Check if user profile is visible
  await expect(page.getByRole('heading', { name: 'Automation User' })).toHaveText('Automation User');
  await expect(page.getByAltText('Automation User')).toBeVisible();
  
  // Optionally, close the page after the test
  await page.close();
});