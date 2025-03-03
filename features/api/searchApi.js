import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const searchApi = createApi({
    reducerPath : 'searchApi',
    baseQuery : fetchBaseQuery({ baseUrl : '/api/' }),
    endpoints : (builder) => ({
        searchItems : builder.query({
            query : (query) => `search?searchQuery=${query}`
        })
    })
})

export const { useSearchItemsQuery } = searchApi