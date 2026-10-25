"use client";
import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ShopList from "@/components/JVR/shopList/ShopList";
import { useRelatedProductsQuery } from "@/features/api/productApi";
import { useSearchItemsQuery } from "@/features/api/searchApi";
import ShopFilter from "@/components/shopFilter/ShopFilter";
import ShopFilterMobile from "@/components/shopFilter/ShopFilterMobile";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ProductGridSkeleton() {
  return (
    <div className="jvr-product-skeleton-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div className="jvr-skeleton jvr-skeleton--img" />
          <div className="jvr-skeleton jvr-skeleton--line" />
          <div className="jvr-skeleton jvr-skeleton--line short" />
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [isFilterPopup, setIsFilterPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || ''
  const search = (searchParams.get('search') || '').trim()

  const categoryQuery = useRelatedProductsQuery(category, { skip: Boolean(search) });
  const searchQuery = useSearchItemsQuery(search, { skip: !search });
  const categoryProducts = search ? searchQuery.data?.products : categoryQuery.data;
  const isLoading = search ? searchQuery.isFetching : categoryQuery.isFetching;
  const error = search ? searchQuery.error : categoryQuery.error;

  useEffect(() => {
    const handleSize = () => {
      setIsMobile(window.innerWidth <= 768);
    }
    handleSize()
    window.addEventListener('resize', handleSize)

    return () => {
      window.removeEventListener('resize', handleSize)
    }
  }, [])
  const toggleFilterPopup = () => {
    setIsFilterPopup(!isFilterPopup);
  }
  const filteredProducts = useMemo(() => {
    if (!categoryProducts) return [];
    
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
      return categoryMatch && typeMatch && priceMatch && sizeMatch;
    });
  }, [categoryProducts, selectedCategory, selectedType, selectedPrice, selectedSize]);

  const hasFilters = selectedCategory.length !== 0 || selectedType.length !== 0 || selectedPrice !== 0 || selectedSize.length !== 0;

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
        {search && (
          <div className="jvr-search-heading">
            <h5>Results for “{search}”</h5>
            <Link href="/shop-2">Clear search</Link>
          </div>
        )}
        {hasFilters && !isLoading ? (
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
                {isLoading ? (
                  <ProductGridSkeleton />
                ) : error ? (
                  <div className="jvr-empty-state">
                    <i className="fal fa-exclamation-circle" />
                    <h3>Couldn&apos;t load products</h3>
                    <p>Please check your connection and try again.</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map(item => (
                    <ShopList
                      key={item._id}
                      id={item._id}
                      name={item.productName}
                      price={item.productPrice}
                      oldPrice={item.productOldPrice}
                      category={item.productCategory}
                      type={item.productType}
                      brand={item.productBrand}
                      variants={item.productVariants}
                    />
                  ))
                ) : (
                  <div className="jvr-empty-state">
                    <i className="fal fa-search" />
                    <h3>No products found</h3>
                    <p>Try a different search or clear some filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
