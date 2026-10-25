'use client'
import useWishlist from "@/components/wishlist/useWishlist"

export default function WishListShow() {
    const { count } = useWishlist()

    return (
        <>
            <span className="tp-product-count">{count}</span>
        </>
    )
}
