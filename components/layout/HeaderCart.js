'use client'
import { useDeleteCartItemMutation, useFetchCartQuery } from "@/features/api/cartApi"
import Link from "next/link"
import { useAuth } from "../AuthContent/AuthContent"
import { toast } from "react-toastify"
import WhatsAppOrderButton from "../whatsapp/WhatsAppOrderButton"
import { cartItemsToOrderItems } from "@/lib/whatsapp"
import { CHECKOUT_ENABLED } from "@/lib/siteConfig"


export default function HeaderCart({ isCartSidebar, handleCartSidebar }) {
    const { userId } = useAuth()

    const { data, isLoading } = useFetchCartQuery(userId, { skip: !userId })
    const cartItems = Array.isArray(data) ? data : []

    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.productPrice, 0)

    const [deleteCartItem] = useDeleteCartItemMutation()
    const handleDelete = async (id) => {
        try {
            await deleteCartItem({ id, userId }).unwrap()
            toast.success("Item removed successfully")
        } catch (error) {
            console.error("Error deleting item:", error)
            toast.error("Failed to remove item")
        }
    }

    return (
        <>
            <div className={`tpcartinfo tp-cart-info-area p-relative ${isCartSidebar ? "tp-sidebar-opened" : ""}`}>
                <button className="tpcart__close" onClick={handleCartSidebar} aria-label="Close cart"><i className="fal fa-times" /></button>
                <div className="tpcart">
                    <h4 className="tpcart__title">Your Cart</h4>
                    <div className="tpcart__product">
                        <div className="tpcart__product-list">
                            <ul>
                                {!userId && (
                                    <li className="jvr-empty-note">
                                        <i className="fal fa-shopping-bag" />
                                        <p><Link href="/sign-in" onClick={handleCartSidebar}>Sign in</Link> to add items to your cart.</p>
                                    </li>
                                )}
                                {userId && isLoading && <li className="jvr-empty-note"><p>Loading your cart…</p></li>}
                                {userId && !isLoading && cartItems.length === 0 && (
                                    <li className="jvr-empty-note">
                                        <i className="fal fa-shopping-bag" />
                                        <p>Your cart is empty. <Link href="/shop-2" onClick={handleCartSidebar}>Start shopping</Link></p>
                                    </li>
                                )}
                                {cartItems.map((item) => (
                                    <li key={`${item.productId}-${item.productSize}-${item.productColor}`}>
                                        <div className="tpcart__item">
                                            <div className="tpcart__img">
                                                <img src={item.productImage} alt={item.productName} />
                                                <button type="button" className="tpcart__del" onClick={() => handleDelete(item.productId)} aria-label={`Remove ${item.productName}`}>
                                                    <i className="far fa-times-circle" />
                                                </button>
                                            </div>
                                            <div className="tpcart__content">
                                                <span className="tpcart__content-title">
                                                    <Link href={`/ShopDetails/${item.productId}`} onClick={handleCartSidebar}>{item.productName}</Link>
                                                </span>
                                                <div className="tpcart__cart-price">
                                                    <span className="quantity">{item.quantity} x </span>
                                                    <span className="new-price">₹{item.productPrice}</span>
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
                            {userId && cartItems.length > 0 && (
                                <div className="tpcart__checkout-btn">
                                    <Link className="tpcart-btn mb-10" href="/cart" onClick={handleCartSidebar}>View Cart</Link>
                                    {CHECKOUT_ENABLED ? (
                                        <Link className="tpcheck-btn" href="/checkout">Checkout</Link>
                                    ) : (
                                        <WhatsAppOrderButton
                                            source="cart"
                                            items={cartItemsToOrderItems(cartItems)}
                                            className="w-100"
                                        />
                                    )}
                                </div>
                            )}
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
