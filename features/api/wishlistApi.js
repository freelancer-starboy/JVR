import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/lib/firebase/firebase";

// Sends a fresh Firebase ID token so the server can identify the user.
export const authorizedBaseQuery = fetchBaseQuery({
  baseUrl: "/api/",
  prepareHeaders: async (headers) => {
    const token = await auth.currentUser?.getIdToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: authorizedBaseQuery,
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    // The userId argument only keys the cache per user; the server trusts the token.
    fetchWishlist: builder.query({
      query: () => "wishlist",
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: ({ productId }) => ({
        url: "wishlist",
        method: "POST",
        body: { productId },
      }),
      // Optimistic update so the heart fills instantly.
      async onQueryStarted({ userId, product }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          wishlistApi.util.updateQueryData("fetchWishlist", userId, (draft) => {
            if (product && !draft.some((item) => item.productId === product.productId)) {
              draft.unshift({ ...product, addedAt: new Date().toISOString() });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: ({ productId }) => ({
        url: `wishlist?productId=${encodeURIComponent(productId)}`,
        method: "DELETE",
      }),
      async onQueryStarted({ userId, productId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          wishlistApi.util.updateQueryData("fetchWishlist", userId, (draft) =>
            draft.filter((item) => item.productId !== productId)
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useFetchWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
