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
        }),
        createCheckout: builder.mutation({
            query: ({ userId, cartItems, details, method, transactionId, status, orderTotal }) => ({
              url: '/checkout/',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: {
                userId,
                cartItems: cartItems.map((item) => ({
                  productId: item.productId,
                  productName: item.productName,
                  quantity: item.quantity,
                  price: item.productPrice,
                  color: item.productColor,
                  size: item.productSize,
                })),
                shippingAddress: {
                  fullName: details.fullName,
                  phone: details.phone,
                  addressLine1: details.addressLine1,
                  addressLine2: details.addressLine2,
                  city: details.city,
                  state: details.state,
                  postalCode: details.postalCode,
                  country: details.country || 'India',
                },
                paymentDetails: {
                  method,
                  transactionId,
                  status,
                },
                orderTotal,
                orderStatus: 'Processing',
              },
            })
          }),
    })
})

export const { useUpdateStockMutation, useDeleteCartMutation, useFetchCheckOutQuery, useStockValidationMutation, useCreateCheckoutMutation } = checkoutApi