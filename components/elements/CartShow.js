'use client'
import { useFetchCartQuery } from "@/features/api/cartApi"
import { reloadCart } from "@/features/shopSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAuth } from "../AuthContent/AuthContent"

export default function CartShow() {
    const { userId} = useAuth()
    const {data: cartItems, error} = useFetchCartQuery(userId)
    const { cart } = useSelector((state) => state.shop) || {}
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(reloadCart())
    }, [dispatch, reloadCart])
    return (
        <>
            <span className="tp-product-count">{cartItems?.length}</span>
        </>
    )
}
