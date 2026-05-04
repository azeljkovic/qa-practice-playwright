import { expect, type Locator, type Page } from "@playwright/test";
import { type ShippingDetails } from "./checkoutPage";

export class OrderConfirmationPage {
  readonly message: Locator;

  constructor(page: Page) {
    this.message = page.locator("#message");
  }

  async assertCheckoutSuccess(details: ShippingDetails, expectedTotal: string) {
    await expect(this.message).toBeVisible();
    await expect(this.message).toContainText("Congrats!");
    await expect(this.message).toContainText(expectedTotal);
    await expect(this.message).toContainText(details.street);
    await expect(this.message).toContainText(details.city);
    await expect(this.message).toContainText(details.country);
  }
}
