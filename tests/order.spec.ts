import { test, expect } from "@playwright/test";
import { LoginPage } from "./pageObjects/loginPage";
import { CheckoutPage } from "./pageObjects/checkoutPage";
import { OrderConfirmationPage } from "./pageObjects/orderConfirmationPage";
import { ShopPage } from "./pageObjects/shopPage";
import {
  defaultShippingDetails,
  expectedOrderProductsAfterModification,
  orderProducts,
} from "./testData/orderData";

test("shopping cart validity", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.bypassLogin();

  await shopPage.addProductsToCart(orderProducts);

  await shopPage.assertCartItems(orderProducts);
  await shopPage.assertCartTotal();
});

test("shopping cart modification", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.bypassLogin();

  await shopPage.addProductsToCart(orderProducts);
  await shopPage.applyCartModifications(orderProducts);

  await shopPage.assertCartRowCount(
    expectedOrderProductsAfterModification.length,
  );
  await shopPage.assertCartItems(
    expectedOrderProductsAfterModification,
    (product) => product.quantity,
  );
  await shopPage.assertCartTotal();
});

// ignoring the fact that this logic conflicts with the previous test
test("forbid adding product to the cart twice", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.bypassLogin();

  await shopPage.addProductToCartTwice(orderProducts[0].name);
});

test("full checkout flow", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);
  const checkoutPage = new CheckoutPage(page);
  const orderConfirmationPage = new OrderConfirmationPage(page);

  await loginPage.bypassLogin();

  await shopPage.addProductsToCart(orderProducts);
  const expectedTotal = await shopPage.getCartTotal();

  await shopPage.proceedToCheckout();
  await checkoutPage.placeOrder(defaultShippingDetails);

  await orderConfirmationPage.assertCheckoutSuccess(
    defaultShippingDetails,
    expectedTotal,
  );
});
