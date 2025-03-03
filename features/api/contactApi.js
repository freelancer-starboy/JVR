import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactApi = createApi({
    reducerPath : 'contactApi',
    baseQuery : fetchBaseQuery({ baseUrl : '/api/' }),
    endpoints : (builder) => ({
        submitForm : builder.mutation({
            query : (data) => ({
                url : 'contact',
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(data)
            })
        })
    })
})


export const { useSubmitFormMutation } = contactApi