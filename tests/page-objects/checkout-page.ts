import { type Locator, type Page } from "@playwright/test";

export type ShippingDetails = {
  phone: string;
  street: string;
  city: string;
  country: string;
};

export class CheckoutPage {
  readonly shippingForm: Locator;

  constructor(page: Page) {
    this.shippingForm = page.locator("#shippingForm");
  }

  async fillShippingDetails(details: ShippingDetails) {
    await this.shippingForm.locator('input[name="phone"]').fill(details.phone);
    await this.shippingForm.locator('input[name="street"]').fill(details.street);
    await this.shippingForm.locator('input[name="city"]').fill(details.city);
    await this.shippingForm.locator("#countries_dropdown_menu").selectOption({
      label: details.country,
    });
  }

  async submitOrder() {
    await this.shippingForm.locator("#submitOrderBtn").click();
  }

  async placeOrder(details: ShippingDetails) {
    await this.fillShippingDetails(details);
    await this.submitOrder();
  }
}
