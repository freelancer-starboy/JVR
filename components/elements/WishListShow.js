'use client'

import { useDispatch, useSelector } from "react-redux"

export default function WishListShow() {
    const { wishlist } = useSelector((state) => state.wishlist) || {}
    const dispatch = useDispatch()
  
    return (
        <>
            <span className="tp-product-count">{wishlist?.length}</span>
        </>
    )
}
