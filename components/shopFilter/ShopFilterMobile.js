'use client'
import React, { useState, useEffect } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useRelatedProductsQuery } from "@/features/api/productApi";

const ShopFilterMobile = ({ 
  closeFilterPopup, 
  onCategorySelect, 
  onTypeSelect, 
  onPriceSelect, 
  onSizeSelect 
}) => {
    const [active, setActive] = useState("Category")
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedSize, setSelectedSize] = useState([]);
    const [price, setPrice] = useState(0);

    const latestCategory = selectedCategory[selectedCategory.length - 1] || null;
    const {
      data: types,
      isError,
      isLoading,
    } = useRelatedProductsQuery(latestCategory);
    const [storedTypes, setStoredTypes] = useState([]);

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

    const handleTypeSelect = (type) => {
      setSelectedTypes((prevTypes) => {
        const updatedTypes = prevTypes.includes(type)
          ? prevTypes.filter((t) => t !== type)
          : [...prevTypes, type];
        onTypeSelect(updatedTypes);
        return updatedTypes;
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

    const handleClearAll = () => {
      setSelectedCategory([]);
      setSelectedTypes([]);
      setSelectedSize([]);
      setPrice(0);
      onCategorySelect([]);
      onTypeSelect([]);
      onPriceSelect(0);
      onSizeSelect([]);
    };

    const options = {
      Category: ['mens', 'women', 'kids'],
      Type: storedTypes.length > 0 ? storedTypes : [],
      Size: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      Price: [
        { key: 500, value: '0 - 500' },
        { key: 1500, value: '500 - 1500' },
        { key: 2500, value: '1500 - 2500' }
      ]
    };

    const renderOptionContent = () => {
      switch(active) {
        case 'Category':
          return options.Category.map((category) => (
            <div key={category}>
              <input 
                type="checkbox" 
                id={category}
                checked={selectedCategory.includes(category)}
                onChange={() => handleCategorySelect(category)}
              />
              <label htmlFor={category} style={{marginLeft: "1rem", marginBottom: "1rem"}}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            </div>
          ));
        
          case 'Type':
            return options.Type.length > 0 
              ? options.Type.map((type) => (
                  <div key={type}>
                    <input 
                      type="checkbox" 
                      id={type}
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeSelect(type)}
                    />
                    <label htmlFor={type} style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  </div>
                ))
              : <p>Select a Category first</p>;
        
        case 'Size':
          return options.Size.map((size) => (
            <div key={size}>
              <input 
                type="checkbox" 
                id={size}
                checked={selectedSize.includes(size)}
                onChange={() => handleSizeSelect(size)}
              />
              <label htmlFor={size} style={{marginLeft: "1rem", marginBottom: "1rem"}}>
                {size}
              </label>
            </div>
          ));
        
        case 'Price':
          return options.Price.map((item) => (
            <div key={item.key}>
              <input 
                type="radio" 
                name="price"
                id={item.key}
                checked={price === item.key}
                onChange={() => handlePriceSelect(item.key)}
              />
              <label htmlFor={item.key} style={{marginLeft: "1rem", marginBottom: "1rem"}}>
                {item.value}
              </label>
            </div>
          ));
      }
    };

    return (
      <div className="mobile-filter-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1rem 0rem 1rem' }}>
          <button onClick={closeFilterPopup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IoMdArrowRoundBack style={{fontSize: "1.5rem"}} />
            <span>Filters</span>
          </button>
          <button onClick={handleClearAll}>Clear All</button>
        </div>

        <div style={{ display: 'flex', backgroundColor: "white"}}>
          {/* Left Column with Options */}
          <div
            style={{
              fontWeight: 'bold',
              backgroundColor: '#F0F4F7',
              width: '40%',
              cursor: 'pointer',
            }}
          >
            {Object.keys(options).map((key) => (
              <div
                key={key}
                onClick={() => setActive(key)}
                style={{
                  padding: '0.5rem 0.5rem  0.5rem',
                  backgroundColor: active === key ? 'white' : '#F0F4F7',
                  color: active === key ? 'black' : 'gray',
                  borderRadius: '4px',
                }}
              >
                {key}
              </div>
            ))}
          </div>

          {/* Right Column with Checkboxes/Radios */}
          <div style={{ padding: '1rem', gap: '1rem'}}>
            {renderOptionContent()}
          </div>
        </div>
      </div>
    )
}

export default ShopFilterMobile