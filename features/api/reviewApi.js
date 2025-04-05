import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

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
        })
    })
})

export const {  useAddReviewMutation } = reviewApi