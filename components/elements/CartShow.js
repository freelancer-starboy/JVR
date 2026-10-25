'use client'
import { useFetchCartQuery } from "@/features/api/cartApi"
import { useAuth } from "../AuthContent/AuthContent"

export default function CartShow() {
    const { userId } = useAuth()
    const { data: cartItems } = useFetchCartQuery(userId, { skip: !userId })
    const count = Array.isArray(cartItems) ? cartItems.length : 0

    return (
        <>
            <span className="tp-product-count">{count}</span>
        </>
    )
}
