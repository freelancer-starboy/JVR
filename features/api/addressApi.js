const { createApi, fetchBaseQuery } = require("@reduxjs/toolkit/query/react");

export const addressApi = createApi({
    reducerPath : 'addressApi',
    baseQuery : fetchBaseQuery({ baseUrl : '/api/' }),
    endpoints : (builder) => ({
        addAddress : builder.mutation({
            query : (data) => ({
                url : 'address/addAddress',
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : data
            })
        }),
        fetchAddress : builder.mutation({
            query : (userId) => ({
                url : 'address/fetchAddress',
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify({ userId })
            })
        }),
        deleteAddress : builder.mutation({
            query : (id) => ({
                url : `address/deleteAddress?id=${id}`,
                method : 'DELETE',
            })
        })
    })
})

export const {useAddAddressMutation, useFetchAddressMutation, useDeleteAddressMutation} = addressApi