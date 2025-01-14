'use client'
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addQty, deleteCart } from "@/features/shopSlice";
import { useState } from "react";
import { set } from "mongoose";
import { useDeleteCartItemMutation } from "@/features/api/cartApi";
import { toast } from "react-toastify";

const CartItems = ({ id, name, quantity, price, total, image, onQuantityChange, onDelete, showEmptyMessage }) => {
   const[ quan, setQuan] = useState(quantity)
const [ showConfirm, setShowConfirm] = useState(false)

   const handleConfirm = (e) => {
    e.preventDefault()
    if(onQuantityChange){
        console.log(id, quan)
        onQuantityChange(id, quan)
        setShowConfirm(false)
    }
   }
   const handleChange = (e) => {
    e.preventDefault()
    setQuan(e.target.value)
    setShowConfirm(true)
    }

    const handleDelete = (e) => {
        e.preventDefault()
        if(onDelete){
            onDelete(id)
        }
    }
    return (
      <>
        {showEmptyMessage ? (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>
              Add items to show in Cart!
            </td>
          </tr>
        ) : (
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
                  value={quan} // Assuming 'quantity' is the correct value here
                  onChange={handleChange} // Use the correct handler
                  min={1}
                />
                  {showConfirm && 
            <button id="add-to-cart" className="add-to-cart" onClick={handleConfirm}>
                Confirm
            </button>
        
           
        }
              </div>
            </td>
            <td className="product-subtotal">
              <span className="amount">${(quantity * price).toFixed(2)}</span>
            </td>
            <td className="product-remove">
              <button className="remove" onClick={handleDelete}>
                <span className="flaticon-dustbin">Remove</span>
              </button>
            </td>
          </tr>
        )}
      </>
    );
    };
  
  

export default CartItems;
