'use client'
import { useRelatedProductsQuery } from '@/features/api/productApi'
import { useState } from 'react'

const ShopFilter = ({ onCategorySelect, onTypeSelect, onPriceSelect }) => {
  const [categoryActive, setCategoryActive] = useState(false)
  const [typeActive, setTypeActive] = useState(false)
  const [priceActive, setPriceActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [price, setPrice] = useState(0);
  const { data : types , isLoading} = useRelatedProductsQuery(selectedCategory)
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    onCategorySelect(category)
  }
  const handlePriceSelect = (value) => {
    setPrice(value)
    onPriceSelect(value)
  }
  const handleTypeSelect = (type) => {
    setSelectedTypes(prevTypes => {
      const updatedTypes = prevTypes.includes(type)
        ? prevTypes.filter(t => t !== type)
        : [...prevTypes, type];
      onTypeSelect(updatedTypes);
      return updatedTypes;
    });
  }
  const renderedTypes = [...new Set(types?.map(type => type.productType))];

  return (
    <div className="custom-filter-main">
      <h3>Refine By</h3>
      
      {/* Category Filter */}
      <div className='custom-select-button'>
        <button onClick={() => setCategoryActive(!categoryActive)}>
          <span>{categoryActive ? '--' : '+'}</span> Category
        </button>
        <div className={`custom-select-button-div ${categoryActive ? 'active' : ''}`}>
          {['all','mens', 'women', 'kids'].map(category => (
            <div key={category}>
              <input 
                type="radio" 
                name='category' 
                value={category} 
                id={category} 
                onChange={() => handleCategorySelect(category)}
              />
              <label htmlFor={category}>
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className='custom-select-button'>
        <button onClick={() => setTypeActive(!typeActive)}>
          <span>{typeActive ? '--' : '+'}</span> Type
        </button>
        <div className={`custom-select-button-div ${typeActive ? 'active' : ''}`}>
          {types && types.length > 0 &&
          (
            <div className='custom-filter-button-div'>
              {renderedTypes.map(type => (
                <div key={type}>
                <input 
                  type="checkbox" 
                  name='type' 
                  value={type} 
                  id={type} 
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeSelect(type)}
                />
                <label htmlFor={type}>
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              </div>
                
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price Filter */}

      <div className='custom-select-button'>
        <button onClick={() => setPriceActive(!priceActive)}>
          <span>{priceActive ? '--' : '+'}</span> Price
        </button>
        <div className={`custom-select-button-div ${priceActive ? 'active' : ''}`}>

          <p>{` ${price} - 2000`}</p>
          <div>
            <input 
            type="range" 
            name='price' 
            min={0} 
            max={2000} 
            id='price' 
            value={price}
            onChange={(e) => handlePriceSelect(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopFilter