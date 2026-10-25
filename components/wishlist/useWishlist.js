"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/components/AuthContent/AuthContent";
import {
  useAddToWishlistMutation,
  useFetchWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/features/api/wishlistApi";

// Shared wishlist state for hearts, header counts and the wishlist page.
export default function useWishlist() {
  const { userId } = useAuth();
  const router = useRouter();
  const { data: items = [], isLoading, isFetching } = useFetchWishlistQuery(userId, {
    skip: !userId,
  });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isWishlisted = (productId) => items.some((item) => item.productId === String(productId));

  // product: a product document from the products API
  const toggle = async (product) => {
    if (!userId) {
      toast.info("Please sign in to save items to your wishlist");
      router.push("/sign-in");
      return;
    }
    const productId = String(product._id);
    try {
      if (isWishlisted(productId)) {
        await removeFromWishlist({ userId, productId }).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({
          userId,
          productId,
          product: {
            productId,
            productName: product.productName,
            productPrice: product.productPrice,
            productOldPrice: product.productOldPrice,
            productImage: product.productVariants?.[0]?.images?.[0] || "",
          },
        }).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Could not update wishlist");
    }
  };

  const remove = async (productId) => {
    try {
      await removeFromWishlist({ userId, productId }).unwrap();
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error?.data?.message || "Could not remove item");
    }
  };

  return {
    userId,
    items: userId ? items : [],
    count: userId ? items.length : 0,
    isLoading: Boolean(userId) && isLoading,
    isFetching,
    isWishlisted,
    toggle,
    remove,
  };
}
