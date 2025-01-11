import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; // Note the /react import

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (cartData) => ({ 
        url: 'cart/addToCart',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: cartData
      })
    }),
    fetchCart: builder.query({
      query: (userId) => `cart/fetchCart?userId=${userId}`
    })
  })
});

export const { useAddToCartMutation, useFetchCartQuery } = cartApi;