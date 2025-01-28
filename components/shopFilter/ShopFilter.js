"use client";
import { useRelatedProductsQuery } from "@/features/api/productApi";
import { useEffect, useState } from "react";

const ShopFilter = ({
  onCategorySelect,
  onTypeSelect,
  onPriceSelect,
  onSizeSelect,
}) => {
  const [categoryActive, setCategoryActive] = useState(false);
  const [typeActive, setTypeActive] = useState(false);
  const [priceActive, setPriceActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [price, setPrice] = useState(0);
  const [sizeActive, setSizeActive] = useState(false);
  
  const latestCategory = selectedCategory[selectedCategory.length - 1] || null;
  const { data: types, isError, isLoading } = useRelatedProductsQuery(latestCategory);
  const [storedTypes, setStoredTypes] = useState([]);

  // Existing useEffect and error handling logic remains the same
  useEffect(() => {
    if (types) {
      setStoredTypes((prev) => {
        const newTypes = types.map((type) => type.productType);
        return [...new Set([...prev, ...newTypes])];
      });
    }
  }, [types]);

  useEffect(() => {
    setStoredTypes((prevTypes) => {
      if (selectedCategory.length === 0) return [];
      const newTypesForSelectedCategories = types?.map((type) => type.productType) || [];
      return [...new Set([...newTypesForSelectedCategories])];
    });
  }, [selectedCategory]);

  // All existing handler functions remain the same
  const handleCategorySelect = (category) => {
    setSelectedCategory((prev) => {
      const updatedCategory = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      onCategorySelect(updatedCategory);
      return updatedCategory;
    });
  };

  const handleSizeSelect = (size) => {
    setSelectedSize((prev) => {
      const updatedSize = prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size];
      onSizeSelect(updatedSize);
      return updatedSize;
    });
  };

  const handlePriceSelect = (value) => {
    setPrice(value);
    onPriceSelect(value);
  };

  const handleTypeSelect = (type) => {
    setSelectedTypes((prevTypes) => {
      const updatedTypes = prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type];
      onTypeSelect(updatedTypes);
      return updatedTypes;
    });
  };

  const removeType = (type) => () => {
    setSelectedTypes((prevTypes) => prevTypes.filter((t) => t !== type));
    onTypeSelect((prevTypes) => prevTypes.filter((t) => t !== type));
  };

  const removeCategory = (category) => () => {
    setSelectedCategory((prev) => prev.filter((c) => c !== category));
    onCategorySelect((prev) => prev.filter((c) => c !== category));
  };

  const removeSize = (size) => () => {
    setSelectedSize((prev) => prev.filter((s) => s !== size));
    onSizeSelect((prev) => prev.filter((s) => s !== size));
  };

  const handleClearAll = () => {
    setSelectedCategory([]);
    setSelectedTypes([]);
    setSelectedSize([]);
    onCategorySelect([]);
    onTypeSelect([]);
    onPriceSelect(0);
    onSizeSelect([]);
  };

  const renderedTypes = [...new Set(storedTypes)];

  return (
    <div className="shop-filter">
      {/* Selected Filters Display */}
      {(selectedCategory.length > 0 || selectedTypes.length > 0) && (
        <div className="bg-light rounded p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0 text-muted">Selected Filters</h6>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleClearAll}
            >
              Clear All <i className="bi bi-x"></i>
            </button>
          </div>
          
          <div className="d-flex flex-wrap gap-2">
            {selectedCategory.map((category, index) => (
              <span key={index} className="badge bg-primary rounded-pill">
                {category}
                <button
                  className="btn-close btn-close-white ms-2"
                  style={{ fontSize: '0.65rem' }}
                  onClick={removeCategory(category)}
                ></button>
              </span>
            ))}
            
            {selectedTypes.map((type, index) => (
              <span key={index} className="badge bg-secondary rounded-pill">
                {type}
                <button
                  className="btn-close btn-close-white ms-2"
                  style={{ fontSize: '0.65rem' }}
                  onClick={removeType(type)}
                ></button>
              </span>
            ))}
            
            {selectedSize.map((size, index) => (
              <span key={index} className="badge bg-info rounded-pill">
                {size}
                <button
                  className="btn-close btn-close-white ms-2"
                  style={{ fontSize: '0.65rem' }}
                  onClick={removeSize(size)}
                ></button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-0 py-3">
          <h5 className="mb-0">Refine By</h5>
        </div>
        
        <div className="card-body p-0">
          {/* Category Filter */}
          <div className="border-bottom">
            <button
              className="btn w-100 d-flex justify-content-between align-items-center px-3 py-3"
              onClick={() => setCategoryActive(!categoryActive)}
            >
              <span className="fw-medium">Category</span>
              <span className="small">{categoryActive ? "−" : "+"}</span>
            </button>
            
            <div className={`px-3 pb-3 ${categoryActive ? "" : "d-none"}`}>
              {["mens", "women", "kids"].map((category) => (
                <div className="form-check mb-2" key={category}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={category}
                    checked={selectedCategory.includes(category)}
                    onChange={() => handleCategorySelect(category)}
                  />
                  <label className="form-check-label" htmlFor={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="border-bottom">
            <button
              className="btn w-100 d-flex justify-content-between align-items-center px-3 py-3"
              onClick={() => setTypeActive(!typeActive)}
            >
              <span className="fw-medium">Type</span>
              <span className="small">{typeActive ? "−" : "+"}</span>
            </button>
            
            <div className={`px-3 pb-3 ${typeActive ? "" : "d-none"}`}>
              {types?.length === 0 ? (
                <p className="text-muted small mb-0">Select any Category</p>
              ) : (
                renderedTypes.map((type) => (
                  <div className="form-check mb-2" key={type}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={type}
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeSelect(type)}
                    />
                    <label className="form-check-label" htmlFor={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Price Filter */}
          <div className="border-bottom">
            <div className="d-flex justify-content-between align-items-center px-3 py-3">
              <button
                className="btn p-0 fw-medium"
                onClick={() => setPriceActive(!priceActive)}
              >
                <span className="me-2">{priceActive ? "−" : "+"}</span>
                Price
              </button>
              {price > 0 && (
                <button
                  className="btn btn-sm text-primary p-0"
                  onClick={() => handlePriceSelect(0)}
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className={`px-3 pb-3 ${priceActive ? "" : "d-none"}`}>
              {[
                { key: 500, value: "0 - 500" },
                { key: 1500, value: "500 - 1500" },
                { key: 2500, value: "1500 - 2500" },
              ].map((item) => (
                <div className="form-check mb-2" key={item.key}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="price"
                    id={item.key}
                    value={item.key}
                    checked={price === item.key}
                    onChange={() => handlePriceSelect(item.key)}
                  />
                  <label className="form-check-label" htmlFor={item.key}>
                    ₹{item.value}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="border-bottom">
            <button
              className="btn w-100 d-flex justify-content-between align-items-center px-3 py-3"
              onClick={() => setSizeActive(!sizeActive)}
            >
              <span className="fw-medium">Size</span>
              <span className="small">{sizeActive ? "−" : "+"}</span>
            </button>
            
            <div className={`px-3 pb-3 ${sizeActive ? "" : "d-none"}`}>
              {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                <div className="form-check mb-2" key={size}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={size}
                    checked={selectedSize.includes(size)}
                    onChange={() => handleSizeSelect(size)}
                  />
                  <label className="form-check-label" htmlFor={size}>
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopFilter;