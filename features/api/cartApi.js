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
    }),
    updateCart: builder.mutation({
      query: ({ id, quantity }) => ({
          url: 'cart/fetchCart',
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, quantity })
      })
  }),
    deleteCartItem : builder.mutation({
      query : (id) => ({
        url : 'cart/fetchCart',
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body : JSON.stringify({id})
      })
    })
  })
});

export const { useAddToCartMutation, useFetchCartQuery, useUpdateCartMutation, useDeleteCartItemMutation } = cartApi;