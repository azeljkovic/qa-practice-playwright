import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly logoutLink: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByTestId('submitBtn');
    this.logoutLink = page.getByRole('link', { name: 'Log Out' });
    this.proceedToCheckoutButton = page.getByRole('button', {
      name: /proceed to checkout/i,
    });
  }

  async goto() {
    await this.page.goto('/auth_ecommerce');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
