import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./filterSlice";
import productSlice from "./productSlice";
import shopSlice from "./shopSlice";
import wishlistSlice from "./wishlistSlice";
import { productsApi } from "./api/productApi";
import { cartApi } from "./api/cartApi";

export const store = configureStore({
  reducer: {
    product: productSlice,
    filter: filterSlice,
    shop: shopSlice,
    wishlist: wishlistSlice,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware).concat(cartApi.middleware),
});
