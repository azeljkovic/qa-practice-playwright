import { type ShippingDetails } from "../pageObjects/checkoutPage";
import { type Product } from "../pageObjects/shopPage";

export const orderProducts: Product[] = [
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

export const expectedOrderProductsAfterModification = orderProducts.filter(
  (product) => Number.parseInt(product.quantity, 10) > 0,
);

export const defaultShippingDetails: ShippingDetails = {
  phone: "+381601234567",
  street: "Dunavska 4",
  city: "Novi Sad",
  country: "Republic of Serbia",
};
