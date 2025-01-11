'use client'
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addQty, deleteCart } from "@/features/shopSlice";

const CartItems = ({ id, name, quantity, price, total, image}) => {
    const { cart } = useSelector((state) => state.shop) || {};

    const dispatch = useDispatch();

    // delete cart item
    const deleteCartHandler = (id) => {
        dispatch(deleteCart(id));
    };

    // qty handler
    const qtyHandler = (id, qty) => {
        dispatch(addQty({ id, qty }));
    };

    return (
        <>
            
                <tr className="cart-item" key={id}>
                    <td className="product-thumbnail">
                        <Link href={`${image}`}>
                            <img 
                            src={`${image}`} alt="cart added product" />
                        </Link>
                    </td>

                    <td className="product-name">
                        <Link href={`/ShopDetails/${id}`}>
                            {name}
                        </Link>
                    </td>

                    <td className="product-price">${price}</td>

                    <td className="product-quantity">
                        <div className="item-quantity">
                            <input
                                type="number"
                                className="qty"
                                name="qty"
                                defaultValue={quantity}
                                min={1}
                                // onChange={(e) =>
                                //     qtyHandler(item?.id, e.target.value)
                                // }
                            />
                        </div>
                    </td>

                    <td className="product-subtotal"> 
                        <span className="amount">
                            {/* ${(item?.qty * item?.price.max).toFixed(2)} */}
                        </span>
                    </td>

                    <td className="product-remove">
                        <button
                            // onClick={() => deleteCartHandler(item?.id)}
                            className="remove"
                        >
                            <span className="flaticon-dustbin">Remove</span>
                        </button>
                    </td>
                </tr>
            
        </>
    );
};

export default CartItems;
