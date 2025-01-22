'use client'
import CartItems from "@/components/elements/CartItems"
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import  { auth} from "@/lib/firebase/firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useDeleteCartItemMutation, useFetchCartQuery, useUpdateCartMutation } from "@/features/api/cartApi"
import { useAuth } from "@/components/AuthContent/AuthContent"
import { toast } from "react-toastify"
import Preloader from "@/components/elements/Preloader"
import { useRouter } from "next/navigation"


export default function Cart() {
    const { cart } = useSelector((state) => state.shop) || {}
const { userId}  = useAuth()
    const [updateQuantity, {loading : quanLoading,  error}] = useUpdateCartMutation()

    const [deleteCartItem, { error: deleteCartError}] = useDeleteCartItemMutation()

        const {data: cartItems, isLoading, isError, refetch} = useFetchCartQuery(userId)
            if(isLoading) {
                return <Preloader />
            }
           
            let total = 0;
            cartItems?.forEach((item) => {
                const price = item.quantity * item.productPrice;
                total = total + price;
            });

            const handleQuantityChange = async(id, quantity) => {
                const response = await updateQuantity({ id, quantity });

                if (response.error) {
                    toast.error("Failed to update quantity");
                } else {
                    toast.success("Quantity updated successfully");
                    refetch()
                    }
                
            }

            const handleDelete = async (id) => {
                try {
                  const response = await deleteCartItem(id).unwrap();
              
                  if (response) {
                    toast.success('Item removed successfully');
                    refetch(); 
                  } else {
                    toast.error('Failed to remove item');
                  }
                } catch (error) {
                  console.error("Error deleting item:", error); 
                  toast.error('Failed to remove item');
                }
              };
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Cart">
                <section className="cart-area pt-80 pb-80 wow fadeInUp" data-wow-duration=".8s" data-wow-delay=".2s">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <form action="#">
                                    <div className="table-content table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="product-thumbnail">Images</th>
                                                    <th className="cart-product-name">Product Name</th>
                                                    <th className="product-price">Unit Price</th>
                                                    <th className="product-color">color</th>
                                                    <th className="product-size">size</th>
                                                    <th className="product-quantity">Quantity</th>
                                                    <th className="product-subtotal">Total</th>
                                                    <th className="product-remove">Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {
  cartItems && cartItems.length === 0 ? (
    <CartItems showEmptyMessage={true} /> 
  ) : (
    cartItems?.map((item) => (
      <CartItems
        key={item.productId}
        id={item.productId}
        name={item.productName}
        quanLoading={quanLoading}
        price={item.productPrice}
        quantity={item.quantity}
        image={item.productImage}
        total={total}
        onQuantityChange={handleQuantityChange}
        onDelete={handleDelete}
        showEmptyMessage={false}  
        color={item.productColor}
        size={item.productSize}
      />
    ))
  )
}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="coupon-all">
                                                <div className="coupon">
                                                    <input id="coupon_code" className="input-text" name="coupon_code" placeholder="Coupon code" type="text" />
                                                    <button className="tp-btn tp-color-btn banner-animation" name="apply_coupon" type="submit">Apply
                                                        Coupon</button>
                                                </div>
                                                {/* <div className="coupon2">
                                                    <button className="tp-btn tp-color-btn banner-animation" name="update_cart" type="submit">Update cart</button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-end">
                                        <div className="col-md-5 ">
                                            <div className="cart-page-total">
                                                <h2>Cart totals</h2>
                                                <ul className="mb-20">
                                                    <li>Subtotal <span>₹{total.toFixed(2)}</span></li>
                                                    <li>Total <span>₹{total.toFixed(2)}</span></li>
                                                </ul>
                                                <Link href="/checkout" className="tp-btn tp-color-btn banner-animation">Proceed to Checkout</Link>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

            </Layout>
        </>
    )
}