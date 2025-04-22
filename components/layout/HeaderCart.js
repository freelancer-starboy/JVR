'use client'
import { useDeleteCartItemMutation, useFetchCartQuery } from "@/features/api/cartApi"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import  { auth} from "@/lib/firebase/firebase"
import { useAuth } from "../AuthContent/AuthContent"
import { toast } from "react-toastify"


export default function HeaderCart({ isCartSidebar, handleCartSidebar }) {
    const { cart } = useSelector((state) => state.shop) || {}
    const { userId } = useAuth()
    
    const dispatch = useDispatch()

    // delete cart item


    // qty handler
  
    
    const {data: cartItems, isLoading, isError, refetch} = useFetchCartQuery(userId)
   
    useEffect(() => {
        if(userId){

            refetch()
        }
    }, [userId, refetch])
   
    let total = 0;
    cartItems?.forEach((item) => {
        const price = item.quantity * item.productPrice;
        total = total + price;
    });

      const [deleteCartItem, { error: deleteCartError }] =
        useDeleteCartItemMutation();
      const handleDelete = async (id) => {
        try {
          const response = await deleteCartItem(id).unwrap();
    
          if (response) {
            toast.success("Item removed successfully");
            refetch();
          } else {
            toast.error("Failed to remove item");
          }
        } catch (error) {
          console.error("Error deleting item:", error);
          toast.error("Failed to remove item");
        }
      };

    return (
        <>
            <div className={`tpcartinfo tp-cart-info-area p-relative ${isCartSidebar ? "tp-sidebar-opened" : ""}`}>
                <button className="tpcart__close" onClick={handleCartSidebar}><i className="fal fa-times" /></button>
                <div className="tpcart">
                    <h4 className="tpcart__title">Your Cart</h4>
                    <div className="tpcart__product" style={{ overflow : "scroll"}}>
                        <div className="tpcart__product-list">
                            <ul>
                                {isError && !userId && <p className="text-center"><span className="text-danger"><a href='/sign-in'>Login</a></span> to add to cart!</p> }
                                {userId && cartItems && cartItems?.length === 0  ? <p className="text-center"><span className="text-danger"><a href='/shop-2'>Add</a></span> items to add to cart!</p> : 

                                cartItems?.map((item,i) => (
                                    <li key={i}>
                                        <div className="tpcart__item">
                                            <div className="tpcart__img">
                                                <img src={`${item.productImage}`} alt="" />
                                                <div className="tpcart__del" onClick={() => handleDelete(item?.productId)}>
                                                    <Link href="#"><i className="far fa-times-circle" /></Link>
                                                </div>
                                            </div>
                                            <div className="tpcart__content">
                                                <span className="tpcart__content-title"><Link href="/shop-details">{item.productName}</Link>
                                                </span>
                                                <div className="tpcart__cart-price">
                                                    <span className="quantity">{item?.quantity} x </span>
                                                    <span className="new-price">₹{item?.productPrice}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                                }
                                
                            </ul>
                        </div>
                        <div className="tpcart__checkout">
                            <div className="tpcart__total-price d-flex justify-content-between align-items-center">
                                <span> Subtotal:</span>
                                <span className="heilight-price"> ₹{total.toFixed(2)}</span>
                            </div>
                            <div className="tpcart__checkout-btn">
                                {isError ?
                                <></>
                                : <>
                                    <Link className="tpcart-btn mb-10" href="/cart">View Cart</Link> 
                                    <Link className="tpcheck-btn" href="/checkout">Checkout</Link>
                                </>
                            }
                                
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
