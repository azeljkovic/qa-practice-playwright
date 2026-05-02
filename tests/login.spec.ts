import { test, expect } from "@playwright/test";
import { env } from "../env";
import { LoginPage } from "./page-objects/login-page";

test("valid login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.email, env.password);

  await loginPage.assertOnLoginPage();

  await expect(loginPage.logoutLink).toBeVisible();
  await expect(loginPage.proceedToCheckoutButton).toBeVisible();
});

[
  {
    name: "non-existent email",
    email: "not-a-real-user@example.com",
    password: env.password,
  },
  {
    name: "valid email and invalid password",
    email: env.email,
    password: "not-the-right-password",
  },
].forEach(({ name, email, password }) => {
  test(`invalid login with ${name}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(email, password);

    await loginPage.assertOnLoginPage();
    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.errorAlert).toContainText("Bad credentials!");

    await expect(loginPage.logoutLink).not.toBeVisible();
    await expect(loginPage.proceedToCheckoutButton).not.toBeVisible();
  });
});
