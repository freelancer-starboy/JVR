"use client";
import { useRelatedProductsQuery } from "@/features/api/productApi";
import { set } from "mongoose";
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
  const {
    data: types,
    isError,
    isLoading,
  } = useRelatedProductsQuery(latestCategory);
  const [storedTypes, setStoredTypes] = useState([]);

  if (isError) {
    console.log(isError);
  }
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
      if (selectedCategory.length === 0) {
        return [];
      }
      const newTypesForSelectedCategories =
        types?.map((type) => type.productType) || [];
      return [...new Set([...newTypesForSelectedCategories])];
    });
  }, [selectedCategory]);
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
  const renderedTypes = [...new Set(storedTypes)];
  const handleClearAll = () => {
    setSelectedCategory([]);
    setSelectedTypes([]);
    setSelectedSize([]);
    onCategorySelect([]);
    onTypeSelect([]);
    onPriceSelect(0);
    onSizeSelect([]);
  };
  return (
    <>
      {selectedCategory.length > 0 || selectedTypes.length > 0 ? (
        <div className="custom-filter-container">
          {selectedCategory.length > 0 || selectedTypes.length > 0 ? (
            <button
              className="custom-filter-clear-all"
              onClick={handleClearAll}
            >
              Clear All <span>x</span>
            </button>
          ) : null}

          <div className="custom-filter-selected">
            {Array.isArray(selectedCategory) &&
              selectedCategory.map((category, index) => (
                <div key={index} className="custom-filter-item">
                  <button
                    className="custom-filter-button"
                    onClick={removeCategory(category)}
                  >
                    {category}
                    <span className="custom-filter-close">x</span>
                  </button>
                </div>
              ))}

            {Array.isArray(selectedTypes) &&
              selectedTypes.map((type, index) => (
                <div key={index} className="custom-filter-item">
                  <button
                    className="custom-filter-button"
                    onClick={removeType(type)}
                  >
                    {type}
                    <span className="custom-filter-close">x</span>
                  </button>
                </div>
              ))}

            {Array.isArray(selectedSize) &&
              selectedSize.map((size, index) => (
                <div key={index} className="custom-filter-item">
                  <button
                    className="custom-filter-button"
                    onClick={removeSize(size)}
                  >
                    {size}
                    <span className="custom-filter-close">x</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      ) : null}

      <div className="pt-30 custom-shop-container"></div>
      <div className="custom-filter-main">
        <h3>Refine By</h3>

        {/* Category Filter */}
        <div className="custom-select-button">
          <button onClick={() => setCategoryActive(!categoryActive)}>
            <span>{categoryActive ? "--" : "+"}</span> Category
          </button>
          <div
            className={`custom-select-button-div ${
              categoryActive ? "active" : ""
            }`}
          >
            {["mens", "women", "kids"].map((category) => (
              <div key={category}>
                <input
                  type="checkbox"
                  name="category"
                  value={category}
                  id={category}
                  checked={selectedCategory.includes(category)}
                  onChange={() => handleCategorySelect(category)}
                />
                <label htmlFor={category}>
                  <span>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="custom-select-button">
          <button onClick={() => setTypeActive(!typeActive)}>
            <span>{typeActive ? "--" : "+"}</span> Type
          </button>
          <div
            className={`custom-select-button-div ${typeActive ? "active" : ""}`}
          >
            {types?.length === 0 && <p>Select any Category</p>}
            {types && types.length > 0 && (
              <div className="custom-filter-button-div">
                {renderedTypes.map((type) => (
                  <div key={type}>
                    <input
                      type="checkbox"
                      name="type"
                      value={type}
                      id={type}
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeSelect(type)}
                    />
                    <label htmlFor={type}>
                      <span>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price Filter */}

        <div className="custom-select-button">
          <div className="custom-type-button">
            <button
              className="test"
              onClick={() => setPriceActive(!priceActive)}
            >
              <span>{priceActive ? "--" : "+"}</span> Price
            </button>
            <button onClick={() => handlePriceSelect(0)}>Clear</button>
          </div>
          <div
            className={`custom-select-button-div ${
              priceActive ? "active" : ""
            }`}
          >
            {[
              { key: 500, value: "0 - 500" },
              { key: 1500, value: "500 - 1500" },
              { key: 2500, value: "1500 - 2500" },
            ].map((item) => (
              <div key={item.key}>
                <input
                  type="radio"
                  name="price"
                  value={item.key}
                  id={item.key}
                  checked={price === item.key}
                  onChange={() => handlePriceSelect(item.key)}
                />
                <label htmlFor={item.key}>
                  <span>{item.value}</span>
                </label>
              </div>
            ))}
          </div>

          {/* Size Filter */}

          <div className="custom-select-button">
            <button onClick={() => setSizeActive(!sizeActive)}>
              <span>{sizeActive ? "--" : "+"}</span> Size
            </button>
            <div
              className={`custom-select-button-div ${
                sizeActive ? "active" : ""
              }`}
            >
              {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                <div key={size}>
                  <input
                    type="checkbox"
                    name="size"
                    value={size}
                    id={size}
                    checked={selectedSize.includes(size)}
                    onChange={() => handleSizeSelect(size)}
                  />
                  <label htmlFor={size}>
                    <span>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* End of size filter */}
        </div>
      </div>
    </>
  );
};

export default ShopFilter;
