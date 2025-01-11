'use client'
import { useFetchCartQuery } from "@/features/api/cartApi"
import { addQty, deleteCart } from "@/features/shopSlice"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import  { auth} from "@/lib/firebase/firebase"


export default function HeaderCart({ isCartSidebar, handleCartSidebar }) {
    const { cart } = useSelector((state) => state.shop) || {}
    const [userId, setUserId] = useState("")

    const dispatch = useDispatch()

    // delete cart item
    const deleteCartHandler = (id) => {
        dispatch(deleteCart(id))
    }

    // qty handler
  
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, fetch uid
                setUserId(user.uid);
                console.log("User signed in:", user.uid);
            } else {
                // User is signed out
                setUserId(null);
                console.warn("No user is logged in");
            }
        })
        return () => unsubscribe()
    }, [])

    const {data: cartItems, isLoading, isError} = useFetchCartQuery(userId)
    if(isLoading) {
        return <p>Loading...</p>
    }
    if(isError) {
        return <p>Error</p>
    }
    let total = 0;
    cartItems?.forEach((item) => {
        const price = item.quantity * item.productPrice;
        total = total + price;
    });
   
    return (
        <>
            <div className={`tpcartinfo tp-cart-info-area p-relative ${isCartSidebar ? "tp-sidebar-opened" : ""}`}>
                <button className="tpcart__close" onClick={handleCartSidebar}><i className="fal fa-times" /></button>
                <div className="tpcart">
                    <h4 className="tpcart__title">Your Cart</h4>
                    <div className="tpcart__product">
                        <div className="tpcart__product-list">
                            <ul>
                                {cartItems?.map((item,i) => (
                                    <li key={i}>
                                        <div className="tpcart__item">
                                            <div className="tpcart__img">
                                                <img src={`${item.productImage}`} alt="" />
                                                <div className="tpcart__del" onClick={() => deleteCartHandler(item?.productId)}>
                                                    <Link href="#"><i className="far fa-times-circle" /></Link>
                                                </div>
                                            </div>
                                            <div className="tpcart__content">
                                                <span className="tpcart__content-title"><Link href="/shop-details">{item.productName}</Link>
                                                </span>
                                                <div className="tpcart__cart-price">
                                                    <span className="quantity">{item?.quantity} x </span>
                                                    <span className="new-price">₹ {item?.productPrice}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="tpcart__checkout">
                            <div className="tpcart__total-price d-flex justify-content-between align-items-center">
                                <span> Subtotal:</span>
                                <span className="heilight-price"> ₹{total.toFixed(2)}</span>
                            </div>
                            <div className="tpcart__checkout-btn">
                                <Link className="tpcart-btn mb-10" href="/cart">View Cart</Link>
                                <Link className="tpcheck-btn" href="/checkout">Checkout</Link>
                            </div>
                        </div>
                    </div>
                    <div className="tpcart__free-shipping text-center">
                        <span>Free shipping for orders <b>under 10km</b></span>
                    </div>
                </div>
            </div>
            <div className={`cartbody-overlay ${isCartSidebar ? "opened" : ""}`} onClick={handleCartSidebar} />
        </>
    )
}
