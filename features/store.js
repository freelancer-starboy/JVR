import { configureStore } from "@reduxjs/toolkit"
import filterSlice from "./filterSlice"
import productSlice from "./productSlice"
import shopSlice from "./shopSlice"
import wishlistSlice from "./wishlistSlice"
import { productsApi } from "./api/productApi"

export const store = configureStore({
    reducer: {
        product: productSlice,
        filter: filterSlice,
        shop: shopSlice,
        wishlist: wishlistSlice,
        [productsApi.reducerPath] : productsApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware),
})
