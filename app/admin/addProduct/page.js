"use client";
import { useAddProductsMutation } from "@/features/api/productApi";
import React, { useState } from "react";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productOldPrice: "",
    productCategory: "",
    productType: "",
    productBrand: "",
    productDetails: [""],
  });

  const [variants, setVariants] = useState([
    { color: "", sizes: [{ size: "", stock: "" }], images: [] },
  ]);

  const [addProduct, { isLoading }] = useAddProductsMutation();

  const handleChange = (e) => {
    const value = e.target.type === "number" ? 
      Number(e.target.value) || "" : 
      e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleVariantChange = (index, key, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][key] = value;
    setVariants(updatedVariants);
  };

  const handleSizeChange = (variantIndex, sizeIndex, field, value) => {
    const updatedVariants = [...variants];
    const parsedValue = field === "stock" ? Number(value) || 0 : value;
    updatedVariants[variantIndex].sizes[sizeIndex][field] = parsedValue;
    setVariants(updatedVariants);
  };

  const addSize = (variantIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes.push({ size: "", stock: 0 });
    setVariants(updatedVariants);
  };

  const removeSize = (variantIndex, sizeIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes.splice(sizeIndex, 1);
    setVariants(updatedVariants);
  };

  const handleImageChange = async (variantIndex, files) => {
    const updatedVariants = [...variants];
    // Store the file objects for upload
    updatedVariants[variantIndex].images = Array.from(files);
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", sizes: [{ size: "", stock: 0 }], images: [] },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Add basic product information
    for (const [key, value] of Object.entries(formData)) {
      if (key === "productDetails") {
        // Filter out empty strings and join with commas
        const details = value.filter(detail => detail.trim());
        formDataToSend.append(key, JSON.stringify(details));
      } else if (key.includes("Price")) {
        // Ensure prices are numbers
        formDataToSend.append(key, Number(value) || 0);
      } else {
        formDataToSend.append(key, value);
      }
    }

    // Process variants
    const processedVariants = variants.map(variant => ({
      color: variant.color,
      sizes: variant.sizes.map(size => ({
        size: size.size,
        stock: Number(size.stock) || 0
      })),
      images: [] // Will be populated with uploaded image URLs
    }));

    // Add variants data
    formDataToSend.append("productVariants", JSON.stringify(processedVariants));

    // Add images separately for each variant
    variants.forEach((variant, variantIndex) => {
      variant.images.forEach((image, imageIndex) => {
        formDataToSend.append(
          `variantImages_${variantIndex}`,
          image,
          `variant${variantIndex}_image${imageIndex}`
        );
      });
    });

    try {
      const response = await addProduct(formDataToSend).unwrap();
      alert("Product added successfully!");

      // Reset form
      setFormData({
        productName: "",
        productPrice: "",
        productOldPrice: "",
        productCategory: "",
        productType: "",
        productBrand: "",
        productDetails: [""],
      });

      setVariants([{ color: "", sizes: [{ size: "", stock: 0 }], images: [] }]);
    } catch (err) {
      console.error("Error:", err);
      alert("Error adding product: " + (err.data?.message || "Unknown error"));
    }
  };

  // JSX remains the same as your original code
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
              {key === "productDetails" ? (
                <textarea
                  name={key}
                  value={formData[key].join("\n")}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value.split("\n") })
                  }
                  placeholder={`Enter ${key} (one per line)`}
                  className="form-control"
                  rows={3}
                />
              ) : (
                <input
                  type={key.includes("Price") ? "number" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${key}`}
                  className="form-control"
                  required={key !== "productOldPrice"}
                />
              )}
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
                onChange={(e) =>
                  handleVariantChange(index, "color", e.target.value)
                }
                placeholder="Enter color"
                required
              />
            </div>

            <div className="mb-3">
              <label>Sizes & Stock:</label>
              {variant.sizes.map((s, i) => (
                <div className="input-group mb-2" key={i}>
                  <input
                    type="text"
                    className="form-control"
                    value={s.size}
                    onChange={(e) =>
                      handleSizeChange(index, i, "size", e.target.value)
                    }
                    placeholder="Enter size"
                    required
                  />
                  <input
                    type="number"
                    className="form-control"
                    value={s.stock}
                    onChange={(e) =>
                      handleSizeChange(index, i, "stock", e.target.value)
                    }
                    placeholder="Enter stock"
                    min="0"
                    required
                  />
                  {variant.sizes.length > 1 && (
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
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files)}
                required={variant.images.length === 0}
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
            disabled={isLoading || variants.length === 0}
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;