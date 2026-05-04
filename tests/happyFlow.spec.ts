import { test } from "@playwright/test";
import { env } from "../env";
import { CheckoutPage } from "./pageObjects/checkoutPage";
import { LoginPage } from "./pageObjects/loginPage";
import { OrderConfirmationPage } from "./pageObjects/orderConfirmationPage";
import { OrderPage } from "./pageObjects/orderPage";
import {
  defaultShippingDetails,
  orderProducts,
} from "./testData/orderData";

test("happy flow: login, order products, and logout", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new OrderPage(page);
  const checkoutPage = new CheckoutPage(page);
  const orderConfirmationPage = new OrderConfirmationPage(page);

  await loginPage.goto();
  await loginPage.login(env.email, env.password);
  await loginPage.assertOnLoginPage();

  await shopPage.addProductsToCart(orderProducts);
  await shopPage.assertCartItems(orderProducts);
  const expectedTotal = await shopPage.getCartTotal();

  await shopPage.proceedToCheckout();
  await checkoutPage.placeOrder(defaultShippingDetails);
  await orderConfirmationPage.assertCheckoutSuccess(
    defaultShippingDetails,
    expectedTotal,
  );

  await loginPage.logout();
  await loginPage.assertLoggedOut();
});
