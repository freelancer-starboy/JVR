import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl : '/api/' }),
    endpoints : (builder) => ({
        createToken : builder.mutation({
            query : (data) => ({
                url: 'cookies',
                method: 'POST',
                body : {token : data},
            })
        }),
        deleteToken : builder.mutation({
            query : () => ({
                url: 'cookies/signout',
                method : 'DELETE',
            })
        })
    })
})

export const { useCreateTokenMutation, useDeleteTokenMutation } = authApi