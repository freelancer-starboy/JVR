"use client";
import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { addQty, deleteCart } from "@/features/shopSlice";
import { useState } from "react";
// import { set } from "mongoose";
// import { useDeleteCartItemMutation } from "@/features/api/cartApi";
// import { toast } from "react-toastify";

const CartItems = ({
  id,
  name,
  quantity,
  price,
  total,
  image,
  onQuantityChange,
  onDelete,
  showEmptyMessage,
  color,
  size,
  stock,
}) => {
  const [quan, setQuan] = useState(quantity);
  const [showConfirm, setShowConfirm] = useState(false);
  const [quantityValue, setQuantityValue] = useState(0);
  const handleConfirm = (e) => {
    e.preventDefault();
    console.log("from option : ", quantityValue);
    if (onQuantityChange) {
      console.log(id, quantityValue);
      onQuantityChange(id, quantityValue);
      setShowConfirm(false);
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    setQuan(e.target.value);
    setShowConfirm(true);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (onDelete) {
      onDelete(id);
    }
  };
  return (
    <>
      {showEmptyMessage ? (
        <tr>
          <td colSpan="8" style={{ textAlign: "center" }}>
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
          <td className="product-price">₹{price}</td>
          <td className="product-color">
            <div
              style={{
                backgroundColor: color,
                width: "2rem",
                height: "2rem",
                border: "1px solid black",
              }}
            ></div>
          </td>
          <td className="product-size">{size}</td>
          <td className="product-quantity">
            <div className="item-quantity">
              <select
                value={quantityValue}
                onChange={(e) => {
                  setQuantityValue(Number(e.target.value));
                  setShowConfirm(true);
                }}
              >
                <option value="" disabled className="form-select">
                  Select Quantity
                </option>
                {Array.from({ length: stock }, (_, i) => (
                  <option value={i + 1}>{i + 1}</option>
                ))}
              </select>
              {/* <input
                type="number"
                className="qty"
                name="qty"
                value={quan} // Assuming 'quantity' is the correct value here
                onChange={handleChange} // Use the correct handler
                min={1}
              /> */}
              {showConfirm && (
                <button
                  id="add-to-cart"
                  className="add-to-cart"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
              )}
            </div>
          </td>
          <td className="product-subtotal">
            <span className="amount">₹{(quantity * price).toFixed(2)}</span>
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
