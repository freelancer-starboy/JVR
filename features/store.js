import { configureStore } from "@reduxjs/toolkit";

import { productsApi } from "./api/productApi";
import { cartApi } from "./api/cartApi";
import { authApi } from "./api/authApi";
import { checkoutApi } from "./api/checkout";
import { addressApi } from "./api/addressApi";
import { contactApi } from "./api/contactApi";
import { searchApi } from "./api/searchApi";
import { reviewApi } from "./api/reviewApi";

export const store = configureStore({
  reducer: {

    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [addressApi.reducerPath] : addressApi.reducer,
    [contactApi.reducerPath] : contactApi.reducer,
    [searchApi.reducerPath] : searchApi.reducer,
    [reviewApi.reducerPath] : reviewApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware).concat(cartApi.middleware).concat(authApi.middleware).concat(checkoutApi.middleware).concat(addressApi.middleware).concat(contactApi.middleware).concat(searchApi.middleware).concat(reviewApi.middleware),
});
