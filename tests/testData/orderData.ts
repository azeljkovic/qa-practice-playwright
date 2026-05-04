import { type ShippingDetails } from "../pageObjects/checkoutPage";
import { type Product } from "../pageObjects/orderPage";

/**
 * {@link Product} fixtures added to the cart during order-flow tests.
 * Tests use this list to drive product selection, requested quantities, and
 * expected line-item values before checkout modifications are applied.
 */
export const orderProducts: Product[] = [
  {
    name: "Apple iPhone 12",
    price: "$905.99",
    quantity: 1,
  },
  {
    name: "Huawei Mate 20 Lite",
    price: "$236.12",
    quantity: 3,
  },
  {
    name: "Samsung Galaxy A32",
    price: "$286.99",
    quantity: 0,
  },
];

/**
 * Expected {@link Product} fixtures after products with zero quantity are removed.
 * Tests compare this filtered list against the order summary after quantity
 * updates to verify that only purchasable items remain.
 */
export const expectedOrderProductsAfterModification = orderProducts.filter(
  (product) => product.quantity > 0,
);

/**
 * Default {@link ShippingDetails} used to complete checkout forms.
 * Tests submit these details and verify they are reflected in the checkout or
 * order confirmation flow.
 */
export const defaultShippingDetails: ShippingDetails = {
  phone: "+381601234567",
  street: "Dunavska 4",
  city: "Novi Sad",
  country: "Republic of Serbia",
};
