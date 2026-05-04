import { expect, type Locator, type Page } from "@playwright/test";

export type Product = {
  name: string;
  price: string;
  quantity: number;
};

export class OrderPage {
  readonly page: Page;
  readonly cartRows: Locator;
  readonly cartTotalPrice: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartRows = page.locator(".cart-items .cart-row");
    this.cartTotalPrice = page.locator(".cart-total-price");
    this.proceedToCheckoutButton = page.getByRole("button", {
      name: /proceed to checkout/i,
    });
  }

  async addProductToCart(productName: string) {
    await this.shopItem(productName)
      .getByRole("button", { name: "ADD TO CART" })
      .click();
  }

  async addProductsToCart(products: Product[]) {
    for (const product of products) {
      await this.addProductToCart(product.name);
    }
  }

  async addProductToCartTwice(productName: string) {
    this.page.on("dialog", async (dialog) => {
      expect(dialog.message()).toBe("This item is already added to the cart");
      expect(dialog.type()).toBe("alert");
      await dialog.accept();
    });

    await this.addProductToCart(productName);
    await this.addProductToCart(productName);
  }

  async updateCartItemQuantity(productName: string, quantity: number) {
    await this.cartRow(productName)
      .locator(".cart-quantity-input")
      .fill(quantity.toString());
  }

  async applyCartModifications(products: Product[]) {
    for (const product of products) {
      if (product.quantity === 0) {
        await this.removeProductFromCart(product.name);
      }

      if (product.quantity > 1) {
        await this.updateCartItemQuantity(product.name, product.quantity);
      }
    }
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async getCartTotal() {
    return this.cartTotalPrice.innerText();
  }

  async removeProductFromCart(productName: string) {
    await this.cartRow(productName)
      .getByRole("button", { name: "REMOVE" })
      .click();
  }

  async assertCartRowCount(count: number) {
    await expect(this.cartRows).toHaveCount(count);
  }

  async assertCartItem(product: Product, expectedQuantity = 1) {
    const row = this.cartRow(product.name);
    const removeButton = row.getByRole("button", { name: "REMOVE" });

    await expect(row).toBeVisible();
    await expect(row.locator(".cart-price")).toHaveText(product.price);
    await expect(row.locator(".cart-quantity-input")).toHaveValue(
      expectedQuantity.toString(),
    );
    await expect(removeButton).toBeVisible();
    await expect(removeButton).toBeEnabled();
  }

  /**
   * Verifies that each expected product appears in the cart with the correct quantity.
   * By default, each product is expected to have quantity "1", but a custom quantity
   * resolver can be provided for cases where quantities vary per product.
   */
  async assertCartItems(
    products: Product[],
    expectedQuantity: (product: Product) => number = () => 1,
  ) {
    for (const product of products) {
      await this.assertCartItem(product, expectedQuantity(product));
    }
  }

  async assertCartTotal() {
    const expectedTotal = await this.calculateCartTotal();
    const actualTotal = this.parsePrice(await this.getCartTotal());

    expect(actualTotal).toBeCloseTo(expectedTotal, 2);
  }

  /**
   * Calculates the expected cart total by summing each cart row's
   * item price multiplied by its selected quantity.
   */
  private async calculateCartTotal() {
    const rowCount = await this.cartRows.count();
    let expectedTotal = 0;

    for (let index = 0; index < rowCount; index++) {
      const row = this.cartRows.nth(index);
      const price = this.parsePrice(
        await row.locator(".cart-price").innerText(),
      );
      const quantity = Number.parseInt(
        await row.locator(".cart-quantity-input").inputValue(),
        10,
      );

      expectedTotal += price * quantity;
    }

    return expectedTotal;
  }

  private shopItem(productName: string) {
    return this.page.locator(".shop-item", {
      has: this.page.locator(".shop-item-title", { hasText: productName }),
    });
  }

  private cartRow(productName: string) {
    return this.cartRows.filter({
      has: this.page.locator(".cart-item-title", { hasText: productName }),
    });
  }

  private parsePrice(price: string) {
    return Number.parseFloat(price.replace("$", ""));
  }
}
