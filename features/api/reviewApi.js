import { createApi } from "@reduxjs/toolkit/query/react";
import { authorizedBaseQuery } from "./wishlistApi";

export const reviewApi = createApi({
    reducerPath : 'reviewApi',
    // Sends the Firebase ID token; the server identifies the reviewer from it.
    baseQuery : authorizedBaseQuery,
    tagTypes : ['Review'],
    endpoints : ( builder ) => ({
        addReview : builder.mutation({
            query : (data) => ({
                url : 'review/addReview',
                method : 'POST',
                body : data
            }),
            invalidatesTags : ['Review']
        }),
        getReview : builder.query({
            query : (id) => `review/getReview?id=${id}`,
            providesTags : ['Review']
        }),
        // The userId argument only keys the cache per user.
        getMyReview : builder.query({
            query : ({ productId }) => `review/mine?productId=${productId}`,
            providesTags : ['Review']
        })
    })
})

export const { useAddReviewMutation, useGetReviewQuery, useGetMyReviewQuery } = reviewApi
