'use client'
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addQty, deleteCart } from "@/features/shopSlice";

const CartItems = ({ id, name, quantity, price, total, image }) => {
    return (
      <tr className="cart-item" key={id}>
        <td className="product-thumbnail">
          <Link href={`${image}`}>
            <img src={`${image}`} alt="cart added product" />
          </Link>
        </td>
        <td className="cart-product-name">
          <Link href={`/ShopDetails/${id}`}>{name}</Link>
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
            />
          </div>
        </td>
        <td className="product-subtotal">
          <span className="amount">${(quantity * price).toFixed(2)}</span>
        </td>
        <td className="product-remove">
          <button className="remove">
            <span className="flaticon-dustbin">Remove</span>
          </button>
        </td>
      </tr>
    );
  };
  
  

export default CartItems;
