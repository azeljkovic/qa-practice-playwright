import { test, expect } from '@playwright/test';
import { env } from '../env';
import { LoginPage } from './page-objects/login-page';

test('valid login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.email, env.password);

  await expect(loginPage.logoutLink).toBeVisible();
  await expect(loginPage.proceedToCheckoutButton).toBeVisible();
});

