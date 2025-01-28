"use client";
import { useAddProductsMutation } from "@/features/api/productApi";
import React, { useState } from "react";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productCategory: "",
    productType: "",
    productBrand: "",
    productOldPrice: "",
    productDetails: [""],
  });

  const [variants, setVariants] = useState([
    { color: "", size: [""], images: [], stock: "" },
  ]);

  const [addProduct, { isLoading, isSuccess, isError, error }] =
    useAddProductsMutation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVariantChange = (index, key, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = value;
    setVariants(updatedVariants);
  };

  const handleSizeChange = (variantIndex, sizeIndex, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].size[sizeIndex] = value;
    setVariants(updatedVariants);
  };

  const addSize = (variantIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].size.push("");
    setVariants(updatedVariants);
  };

  const removeSize = (variantIndex, sizeIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].size.splice(sizeIndex, 1);
    setVariants(updatedVariants);
  };

  const handleImageChange = (variantIndex, files) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images = Array.from(files);
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { color: "", size: [""], images: [], stock: "" }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
    });

    variants.forEach((variant, i) => {
      const { color, size, stock, images } = variant;
      formDataToSend.append(`productVariants[${i}][color]`, color);
      formDataToSend.append(`productVariants[${i}][stock]`, stock);
      formDataToSend.append(`productVariants[${i}][size]`, JSON.stringify(size));
      images.forEach((image, j) =>
        formDataToSend.append(`productVariants[${i}][images][${j}]`, image)
      );
    });

    try {
      await addProduct(formDataToSend).unwrap();
      alert("Product added successfully!");

      setFormData({
        productName: "",
        productPrice: "",
        productCategory: "",
        productType: "",
        productBrand: "",
        productOldPrice: "",
        productDetails: [""],
      });
      setVariants([{ color: "", size: [""], images: [], stock: "" }]);
    } catch (err) {
      console.error("Error:", err);
      alert("Error while adding product!");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {Object.keys(formData).map((key) => (
            <div className="col-md-6 mb-3" key={key}>
              <label htmlFor={key} className="form-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type={key.includes("Price") ? "number" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className="form-control"
              />
            </div>
          ))}
        </div>

        <h3 className="mt-4">Product Variants:</h3>
        {variants.map((variant, index) => (
          <div className="border rounded p-3 my-3" key={index}>
            <h5>Variant {index + 1}</h5>

            <div className="mb-3">
              <label>Color:</label>
              <input
                type="text"
                className="form-control"
                value={variant.color}
                onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                placeholder="Enter color"
              />
            </div>

            <div className="mb-3">
              <label>Stock:</label>
              <input
                type="number"
                className="form-control"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                placeholder="Enter stock"
              />
            </div>

            <div className="mb-3">
              <label>Sizes:</label>
              {variant.size.map((s, i) => (
                <div className="input-group mb-2" key={i}>
                  <input
                    type="text"
                    className="form-control"
                    value={s}
                    onChange={(e) => handleSizeChange(index, i, e.target.value)}
                    placeholder="Enter size"
                  />
                  {variant.size.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeSize(index, i)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={() => addSize(index)}
              >
                Add Size
              </button>
            </div>

            <div className="mb-3">
              <label>Images:</label>
              <input
                type="file"
                className="form-control"
                multiple
                onChange={(e) => handleImageChange(index, e.target.files)}
              />
            </div>

            {variants.length > 1 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeVariant(index)}
              >
                Remove Variant
              </button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={addVariant}>
          Add Variant
        </button>

        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>

      {isSuccess && <p className="alert alert-success mt-4">Product added successfully!</p>}
      {isError && (
        <p className="alert alert-danger mt-4">
          Error: {error?.data?.message || "Failed to add product."}
        </p>
      )}
    </div>
  );
};

export default AddProduct;
