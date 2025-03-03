import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./filterSlice";
import productSlice from "./productSlice";
import shopSlice from "./shopSlice";
import wishlistSlice from "./wishlistSlice";
import { productsApi } from "./api/productApi";
import { cartApi } from "./api/cartApi";
import { authApi } from "./api/authApi";
import { checkoutApi } from "./api/checkout";
import { addressApi } from "./api/addressApi";
import { contactApi } from "./api/contactApi";
import { searchApi } from "./api/searchApi";

export const store = configureStore({
  reducer: {
    product: productSlice,
    filter: filterSlice,
    shop: shopSlice,
    wishlist: wishlistSlice,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [addressApi.reducerPath] : addressApi.reducer,
    [contactApi.reducerPath] : contactApi.reducer,
    [searchApi.reducerPath] : searchApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware).concat(cartApi.middleware).concat(authApi.middleware).concat(checkoutApi.middleware).concat(addressApi.middleware).concat(contactApi.middleware).concat(searchApi.middleware),
});
