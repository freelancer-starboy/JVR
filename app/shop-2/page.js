"use client";
import { useState, useMemo, useEffect } from "react";
import Preloader from "@/components/elements/Preloader";
import Layout from "@/components/layout/Layout";
import ShopList from "@/components/JVR/shopList/ShopList";
import { useFetchProductsQuery, useRelatedProductsQuery } from "@/features/api/productApi";
import ShopFilter from "@/components/shopFilter/ShopFilter";
import { IoMdArrowRoundBack } from "react-icons/io";
import ShopFilterMobile from "@/components/shopFilter/ShopFilterMobile";
import { useSearchParams } from "next/navigation";

export default function ShopPage() {
  const { data: products, error, isLoading } = useFetchProductsQuery();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [isFilterPopup, setIsFilterPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || ''

  const { data: categoryProducts } = useRelatedProductsQuery(category);
  useEffect(() => {
    const handleSize = () => {
      setIsMobile(window.innerWidth <= 768);
    }
    handleSize()
    console.log("isMobile", isMobile);
    window.addEventListener('resize', handleSize)

    return () => {
      window.removeEventListener('resize', handleSize)
    }
  }, [isMobile])
  const toggleFilterPopup = () => {
    setIsFilterPopup(!isFilterPopup);
  }
  const filteredProducts = useMemo(() => {
    if (!categoryProducts) return [];
    
    console.log("categoryProducts", categoryProducts);
    return categoryProducts.filter(item => {
      const categoryMatch =
        selectedCategory.length === 0 ||
        selectedCategory.some(category =>
          item.productCategory?.toLowerCase() === category.toLowerCase()
        );

      const typeMatch =
        selectedType.length === 0 ||
        selectedType.some(type =>
          item.productType?.toLowerCase() === type.toLowerCase()
        );

      let reducedPrice = 0;
      if (selectedPrice === 1500) reducedPrice = 500;
      else if (selectedPrice === 2500) reducedPrice = 1500;

      const priceMatch =
        selectedPrice === 0 ||
        (item.productPrice >= reducedPrice && item.productPrice <= selectedPrice);

        const sizeMatch =
        selectedSize.length === 0 ||
        item.productVariants.some(variant => 
          variant.sizes?.some(sizeItem => selectedSize.includes(sizeItem.size.trim()))
        );
        console.log("sizeMatch", sizeMatch);
      return categoryMatch && typeMatch && priceMatch && sizeMatch;
    });
  }, [categoryProducts, selectedCategory, selectedType, selectedPrice, selectedSize]);

  if (isLoading) return <Preloader />;
  if (error) return <div>Error: {error.message}</div>;

  
  return (
    <Layout headerStyle={3} footerStyle={2}>
      {/* Mobile Filter */}
    
      <div className="mobile-filter-container">
        <button className="mobile-filter-button" onClick={toggleFilterPopup}>
          FILTERS
        </button>
      </div>
      {isMobile && isFilterPopup && (
        <ShopFilterMobile closeFilterPopup={toggleFilterPopup} onCategorySelect={setSelectedCategory}
        onTypeSelect={setSelectedType}
        onPriceSelect={setSelectedPrice}
        onSizeSelect={setSelectedSize} />
      )}
      
      
      {/* End of mobile filter */}
      <div className="product-area pt-70 pb-20">
        {selectedCategory.length !== 0 || selectedType.length !== 0 || selectedPrice !== 0 || selectedSize.length !== 0 ? (
          <h5 className="custom-mobile-filter-title" style={{fontSize: "30px", marginLeft: "20%"}}>{filteredProducts.length} Products</h5>
        ) : null}
        <div className="custom-container">
          <div className="row">
            <div className="custom-filter-main-parent">

              <div className="custom-filter-inside-parent">
                <ShopFilter
                  onCategorySelect={setSelectedCategory}
                  onTypeSelect={setSelectedType}
                  onPriceSelect={setSelectedPrice}
                  onSizeSelect={setSelectedSize}
                />
              </div>

              <div className="custom-main-product flex flex-wrap -mx-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(item => (
                    <ShopList
                      // key={item._id}
                      // thumb1={item.productImage[0]}
                      // thumb2={item.productImage[1]}
                      id={item._id}
                      name={item.productName} /* done */
                      price={item.productPrice} /* done */
                      oldPrice={item.productOldPrice} /* done */
                      category={item.productCategory} /* done */
                      type={item.productType} /* done */
                      brand={item.productBrand} /* done */
                      // color={item.productColor}
                      variants={item.productVariants}
                    />
                  ))
                ) : (
                  <div>No products found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
