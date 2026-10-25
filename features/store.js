import { configureStore } from "@reduxjs/toolkit";

import { productsApi } from "./api/productApi";
import { cartApi } from "./api/cartApi";
import { authApi } from "./api/authApi";
import { checkoutApi } from "./api/checkout";
import { addressApi } from "./api/addressApi";
import { contactApi } from "./api/contactApi";
import { searchApi } from "./api/searchApi";
import { reviewApi } from "./api/reviewApi";
import { wishlistApi } from "./api/wishlistApi";

const apis = [
  productsApi,
  cartApi,
  authApi,
  checkoutApi,
  addressApi,
  contactApi,
  searchApi,
  reviewApi,
  wishlistApi,
];

export const store = configureStore({
  reducer: Object.fromEntries(apis.map((api) => [api.reducerPath, api.reducer])),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.map((api) => api.middleware)),
});
