'use client'
import { useFetchCartQuery } from "@/features/api/cartApi"

import { useDispatch, useSelector } from "react-redux"
import { useAuth } from "../AuthContent/AuthContent"

export default function CartShow() {
    const { userId} = useAuth()
    const {data: cartItems, error} = useFetchCartQuery(userId)
    const { cart } = useSelector((state) => state.shop) || {}
    const dispatch = useDispatch()

    return (
        <>
            <span className="tp-product-count">{cartItems?.length}</span>
        </>
    )
}
