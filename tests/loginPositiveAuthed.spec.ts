import test, { expect } from "@playwright/test";

test('Check am I Logged in via saved auth state test @Login @Regression', async ({ page }) => {
  await page.goto('https://ovcharski.com/shop/login/');
  
  const automationUserLink = page.getByRole('link', { name: 'Automation User' });
  const automationUserText = page.getByText('Automation User');
  const yourAccountLink = page.getByRole('link', { name: 'Your account' });

  await expect(automationUserLink).toBeVisible();
  await expect(automationUserText).toBeVisible();
  await expect(yourAccountLink).toBeVisible();

  await page.close();
});