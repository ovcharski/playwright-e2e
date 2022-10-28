// Example test showing the basics of a playwright test 

// Importing the test and expect library from playwright. Without them we cannot test and assert
import { test, expect } from '@playwright/test';

// Name of the test. Async function. Page parameter. The page fixture allows us to interact with the tab in our browser  
test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {

  // Opens the URL in a browser. Await is waiting for a promise to be returned. Waiting for a code to be resolved. What's a promise - just an object that may produce a value at some time in the future.
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  // create a locator in a getStarted const value
  const getStarted = page.locator('text=Get Started');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', '/docs/intro');

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});

/* 

A child has a toy. And you are saying "Can I have that toy?". The child will say "Yes, I will give you the toy". But you never know exactly when this will happen.
In this case you've got two options. You can say OK and carry on with the rest of the code and I'll come back and see is it resolved.
Or 
Let's wait for the child to give us the toy and only then I am gonna through the next line of code 

Anatomy of a Playwright test - https://www.youtube.com/watch?v=35wsgc5lixI
*/
