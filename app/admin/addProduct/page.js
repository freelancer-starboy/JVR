"use client";
import { useAddProductsMutation } from "@/features/api/productApi";
import React, { useState } from "react";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    // productDescription: "",
    productCategory: "",
    productType: "",
    productBrand: "",
    productOldPrice: "",
    productStock: "",
  });

  const [images, setImages] = useState([]); // To handle multiple image uploads
  const [size, setSize] = useState([""]); // Initialize with one empty size input
  const [color, setColor] = useState([""]); // Initialize with one empty color input
  const [details, setDetails] = useState([""]);

  // Handle general form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle size input changes
  const handleSizeInputChange = (e, index) => {
    const newArray = [...size];
    newArray[index] = e.target.value;
    setSize(newArray);
  };

  const handleSizeInputAdd = () => {
    setSize([...size, ""]); // Add an empty size
  };

  const handleSizeInputRemove = (index) => {
    const newArray = size.filter((_, i) => i !== index);
    setSize(newArray);
  };

  // Handle color input changes
  const handleColorInputChange = (e, index) => {
    const newArray = [...color];
    newArray[index] = e.target.value;
    setColor(newArray);
  };

  const handleColorInputAdd = () => {
    setColor([...color, ""]); // Add an empty color
  };

  const handleColorInputRemove = (index) => {
    const newArray = color.filter((_, i) => i !== index);
    setColor(newArray);
  };

  // details change
  
  const handleDetailsInputChange = (e, index) => {
    const newArray = [...details];
    newArray[index] = e.target.value;
    setDetails(newArray);
  };

  const handleDetailsInputAdd = () => {
    setDetails([...details, ""]); // Add an empty color
  };

  const handleDetailsInputRemove = (index) => {
    const newArray = color.details((_, i) => i !== index);
    setDetails(newArray);
  };

  // Handle image file uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Mutation for adding products
  const [addProduct, { isLoading, isSuccess, isError, error }] =
    useAddProductsMutation();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to submit the product data
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // Append images
    images.forEach((image) => {
      formDataToSend.append("productImage", image);
    });

    // Append sizes
    size.forEach((s) => {
      formDataToSend.append("productSize", s);
    });

    // Append details
    details.forEach((d) => {
      formDataToSend.append("productDetails", d);
    });

    // Append colors
    color.forEach((c) => {
      formDataToSend.append("productColor", c);
    });

    try {
      await addProduct(formDataToSend).unwrap();
      alert("Product added successfully");

      // Reset form
      setFormData({
        productName: "",
        productPrice: "",
        // productDescription: "",
        productCategory: "",
        productType: "",
        productBrand: "",
        productOldPrice: "",
        productStock: "",
      });
      setImages([]);
      setSize([""]); // Reset to one empty input
      setColor([""]); // Reset to one empty input
      setDetails([""]);
    } catch (err) {
      console.error("Error:", err);
      alert("Error while adding product!");
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Image input */}
        <label htmlFor="productImage">Product Images:</label>
        <input
          type="file"
          onChange={handleImageChange}
          name="productImage"
          accept="image/*"
          multiple
        />

        {/* General product details */}
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              type={key.includes("Price") || key === "productStock" ? "number" : "text"}
              placeholder={`Enter ${key.replace(/product/, "")}`}
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Sizes */}
        <div>
          <label>Product Sizes:</label>
          {size.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleSizeInputChange(e, index)}
                placeholder="Enter Size"
              />
              {size.length > 1 && (
                <button type="button" onClick={() => handleSizeInputRemove(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleSizeInputAdd}>
            Add Size
          </button>
        </div>

        {/* Colors */}
        <div>
          <label>Product Colors:</label>
          {color.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleColorInputChange(e, index)}
                placeholder="Enter Color"
              />
              {color.length > 1 && (
                <button type="button" onClick={() => handleColorInputRemove(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleColorInputAdd}>
            Add Color
          </button>
        </div>

        {/* Product Details */}
        <div>
          <label>Product Details:</label>
          {details.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleDetailsInputChange(e, index)}
                placeholder="Enter Details"
              />
              {details.length > 1 && (
                <button type="button" onClick={() => handleDetailsInputRemove(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleDetailsInputAdd}>
            Add Details
          </button>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
      {isSuccess && <p>Product added successfully!</p>}
      {isError && <p>Error: {error?.data?.message || "Failed to add product."}</p>}
    </div>
  );
};

export default AddProduct;
