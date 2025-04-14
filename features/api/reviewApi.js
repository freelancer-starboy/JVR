import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
    reducerPath : 'reviewApi',
    baseQuery : fetchBaseQuery({ baseUrl : '/api/' }),
    endpoints : ( builder ) => ({
        addReview : builder.mutation({
            query : (data) => ({
                url : 'review/addReview',
                method : 'POST',
                body : data
            })
        }),
        getReview : builder.query({
            query : (id) => `review/getReview?id=${id}`
        })
    })
})

export const {  useAddReviewMutation, useGetReviewQuery } = reviewApi