import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly logoutLink: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly url = '/auth_ecommerce';

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

  async bypassLogin() {
  await this.page.goto(this.url);
  await this.page.evaluate(() => {
    const result = document.getElementById('message');
    // @ts-expect-error page script defines this globally
    window.setSuccessAlert(result, env.email);
  });
}

}
