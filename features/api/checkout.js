import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const checkoutApi = createApi({
    reducerPath: 'checkoutApi',
    baseQuery : fetchBaseQuery({ baseUrl : '/api/' }),
    endpoints : (builder) => ({
        updateStock : builder.mutation({
            query : (data) => ({
                url : 'cart/addToCart',
                method : 'PUT',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(data)
            })
        }),
        deleteCart : builder.mutation({
            query : (userId) => ({
                url : 'cart/deleteCart',
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })
        }),
        fetchCheckOut : builder.query({
            query : (userId) => `checkout?id=${userId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }),
        stockValidation : builder.mutation({
            query : (cartItems) => ({
                url : 'cart/stockValidation',
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : { cartItems}
            })
        })
    })
})

export const { useUpdateStockMutation, useDeleteCartMutation, useFetchCheckOutQuery, useStockValidationMutation } = checkoutApi