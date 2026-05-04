import { test } from "@playwright/test";
import { LoginPage } from "./pageObjects/loginPage";
import { CheckoutPage } from "./pageObjects/checkoutPage";
import { OrderConfirmationPage } from "./pageObjects/orderConfirmationPage";
import { OrderPage } from "./pageObjects/orderPage";
import {
  defaultShippingDetails,
  expectedOrderProductsAfterModification,
  orderProducts,
} from "./testData/orderData";

test("shopping cart validity", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const orderPage = new OrderPage(page);

  await loginPage.bypassLogin();

  await orderPage.addProductsToCart(orderProducts);

  await orderPage.assertCartItems(orderProducts);
  await orderPage.assertCartTotal();
});

test("shopping cart modification", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const orderPage = new OrderPage(page);

  await loginPage.bypassLogin();

  await orderPage.addProductsToCart(orderProducts);
  await orderPage.applyCartModifications(orderProducts);

  await orderPage.assertCartRowCount(
    expectedOrderProductsAfterModification.length,
  );
  await orderPage.assertCartItems(
    expectedOrderProductsAfterModification,
    (product) => product.quantity,
  );
  await orderPage.assertCartTotal();
});

// ignoring the fact that this logic conflicts with the previous test
test("forbid adding product to the cart twice", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const orderPage = new OrderPage(page);

  await loginPage.bypassLogin();

  await orderPage.addProductToCartTwice(orderProducts[0].name);
});

test("full checkout flow", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const orderPage = new OrderPage(page);
  const checkoutPage = new CheckoutPage(page);
  const orderConfirmationPage = new OrderConfirmationPage(page);

  await loginPage.bypassLogin();

  await orderPage.addProductsToCart(orderProducts);
  const expectedTotal = await orderPage.getCartTotal();

  await orderPage.proceedToCheckout();
  await checkoutPage.placeOrder(defaultShippingDetails);

  await orderConfirmationPage.assertCheckoutSuccess(
    defaultShippingDetails,
    expectedTotal,
  );
});
