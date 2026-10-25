import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'; // Note the /react import

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: 'cart/addToCart',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: cartData
      }),
      invalidatesTags: ['Cart']
    }),
    fetchCart: builder.query({
      query: (userId) => `cart/fetchCart?userId=${userId}`,
      providesTags: ['Cart']
    }),
    fetchStock: builder.mutation({
      query: (data) => ({
        url: 'cart/stockUpdation',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    }),
    updateCart: builder.mutation({
      query: ({ id, quantity, userId }) => ({
        url: `cart/fetchCart?userId=${userId}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity })
      }),
      invalidatesTags: ['Cart']
    }),
    deleteCartItem: builder.mutation({
      query: ({ id, userId }) => ({
        url: `cart/fetchCart?userId=${userId}`,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }),
      invalidatesTags: ['Cart']
    })
  })
});

export const { useAddToCartMutation, useFetchCartQuery, useUpdateCartMutation, useDeleteCartItemMutation, useFetchStockMutation } = cartApi;
