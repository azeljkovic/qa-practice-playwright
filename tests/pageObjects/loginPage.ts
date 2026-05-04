import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly logoutLink: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly url = '/auth_ecommerce';
  readonly logoutUrl = '/auth_ecommerce.html';

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByTestId('submitBtn');
    this.errorAlert = page.getByRole('alert');
    this.logoutLink = page.getByRole('link', { name: 'Log Out' });
    this.proceedToCheckoutButton = page.getByRole('button', {
      name: /proceed to checkout/i,
    });
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async assertOnLoginPage() {
    await this.page.waitForURL(this.url);
  }

  async assertOnLogoutPage() {
    await this.page.waitForURL(this.logoutUrl);
  }

  async assertLoggedIn() {
    await this.assertOnLoginPage();
    await expect(this.logoutLink).toBeVisible();
    await expect(this.proceedToCheckoutButton).toBeVisible();
  }

  async assertBadCredentials() {
    await this.assertOnLoginPage();
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toContainText('Bad credentials!');
    await expect(this.logoutLink).not.toBeVisible();
    await expect(this.proceedToCheckoutButton).not.toBeVisible();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async assertLoggedOut() {
    await this.assertOnLogoutPage();
    await expect(this.logoutLink).not.toBeVisible();
    await expect(this.proceedToCheckoutButton).not.toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async bypassLogin() {
    await this.page.goto(this.url);
    await this.page.evaluate(() => {
      const result = document.getElementById('message');
      // @ts-expect-error page script defines this globally
      window.setSuccessAlert(result, 'admin@admin.com');
    });
  }
}
