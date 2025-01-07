'use client';
import { useAddProductsMutation } from '@/features/api/productApi';
import React, { useState } from 'react';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
    productCategory: "",
    productType: "",
    productBrand: "",
  });
  
  const [images, setImages] = useState([]); // To handle multiple image uploads
  
  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Dynamically update the state
    });
  };

  // Handle image change (multiple files)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setImages(files);
  };

  const [addProduct, { isLoading, isSuccess, isError, error, }] = useAddProductsMutation()
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData to submit the product data including images
    const formDataToSend = new FormData();
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('productPrice', formData.productPrice);
    formDataToSend.append('productDescription', formData.productDescription);
    formDataToSend.append('productCategory', formData.productCategory);
    formDataToSend.append('productType', formData.productType);
    formDataToSend.append('productBrand', formData.productBrand);
    
    // Append images to FormData
    images.forEach((image, index) => {
      formDataToSend.append(`productImage`, image); // Add multiple files
    });

    try {
      await addProduct(formDataToSend).unwrap()
      alert('Product added successfully')
      setFormData({
        productName: "",
        productPrice: "",
        productDescription: "",
        productCategory: "",
        productType: "",
        productBrand: "",
      });
      setImages([])
    } catch (error) {
      console.error('Error:', err);
      alert('Error while adding product!');
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Image input for multiple images */}
        <label htmlFor="productImage">Product Images:</label>
        <input 
          type="file" 
          onChange={handleImageChange} 
          name="productImage" 
          accept="image/*" 
          multiple // Allow multiple file uploads
        />
        
        {/* Product details */}
        <label htmlFor="productName">Product Name:</label>
        <input 
          type="text" 
          placeholder="Enter Product Name" 
          name="productName" 
          onChange={handleChange} 
          value={formData.productName} 
        />
        
        <label htmlFor="productPrice">Product Price:</label>
        <input 
          type="number" 
          placeholder="Enter Product Price" 
          name="productPrice" 
          onChange={handleChange} 
          value={formData.productPrice} 
        />
        
        <label htmlFor="productDescription">Product Description:</label>
        <input 
          type="text" 
          placeholder="Enter Product Description" 
          name="productDescription" 
          onChange={handleChange} 
          value={formData.productDescription} 
        />
        
        <label htmlFor="productCategory">Product Category:</label>
        <input 
          type="text" 
          placeholder="Enter Product Category" 
          name="productCategory" 
          onChange={handleChange} 
          value={formData.productCategory} 
        />
        
        <label htmlFor="productType">Product Type:</label>
        <input 
          type="text" 
          placeholder="Enter Product Type" 
          name="productType" 
          onChange={handleChange} 
          value={formData.productType} 
        />
        
        <label htmlFor="productBrand">Product Brand:</label>
        <input 
          type="text" 
          placeholder="Enter Product Brand" 
          name="productBrand" 
          onChange={handleChange} 
          value={formData.productBrand} 
        />
        
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
