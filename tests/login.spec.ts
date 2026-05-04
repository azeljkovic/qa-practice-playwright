import { test } from "@playwright/test";
import { env } from "../env";
import { LoginPage } from "./pageObjects/loginPage";

test("valid login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.email, env.password);

  await loginPage.assertLoggedIn();
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

    await loginPage.assertBadCredentials();
  });
});

test("logout", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.bypassLogin();
  await loginPage.logout();
  await loginPage.assertLoggedOut();
});
