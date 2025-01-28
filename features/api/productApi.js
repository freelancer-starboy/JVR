import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: () => 'addProducts',
    }),
    fetchProductsById : builder.query({
      query : (id) => `fetchProducts/${id}`
    }),
    relatedProducts: builder.query({
      query : (category) => `fetchProducts?category=${category}`
    }),
    addProducts: builder.mutation({
      query: (data) => ({
        url: 'addProducts',
        method: 'POST',
        body: data
      })
    })
  }),
});

export const { useFetchProductsQuery, useAddProductsMutation, useFetchProductsByIdQuery, useRelatedProductsQuery } = productsApi;
