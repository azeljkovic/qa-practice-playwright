import { test, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/login-page";
import {
  CheckoutPage,
  type ShippingDetails,
} from "./page-objects/checkout-page";
import { OrderConfirmationPage } from "./page-objects/order-confirmation-page";
import { ShopPage, type Product } from "./page-objects/shop-page";

const products: Product[] = [
  {
    name: "Apple iPhone 12",
    price: "$905.99",
    quantity: "1",
  },
  {
    name: "Huawei Mate 20 Lite",
    price: "$236.12",
    quantity: "3",
  },
  {
    name: "Samsung Galaxy A32",
    price: "$286.99",
    quantity: "0",
  },
];

const expectedProducts = products.filter(
  (product) => Number.parseInt(product.quantity, 10) > 0,
);

const shippingDetails: ShippingDetails = {
  phone: "+381601234567",
  street: "Dunavska 4",
  city: "Novi Sad",
  country: "Republic of Serbia",
};

test("shopping cart validity", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.bypassLogin();

  await shopPage.addProductsToCart(products);

  await shopPage.assertCartItems(products);
  await shopPage.assertCartTotal();
});

test("shopping cart modification", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.bypassLogin();

  await shopPage.addProductsToCart(products);
  await shopPage.applyCartModifications(products);

  await shopPage.assertCartRowCount(expectedProducts.length);
  await shopPage.assertCartItems(
    expectedProducts,
    (product) => product.quantity,
  );
  await shopPage.assertCartTotal();
});

// ignoring the fact that this logic conflicts with the previous test
test("forbid adding product to the cart twice", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);

  await loginPage.bypassLogin();

  await shopPage.addProductToCartTwice(products[0].name);
});

test("full checkout flow", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const shopPage = new ShopPage(page);
  const checkoutPage = new CheckoutPage(page);
  const orderConfirmationPage = new OrderConfirmationPage(page);

  await loginPage.bypassLogin();

  await shopPage.addProductsToCart(products);
  const expectedTotal = await shopPage.getCartTotal();

  await shopPage.proceedToCheckout();
  await checkoutPage.placeOrder(shippingDetails);

  await orderConfirmationPage.assertCheckoutSuccess(
    shippingDetails,
    expectedTotal,
  );
});
