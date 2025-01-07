"use client";
import ShopList from "@/components/JVR/shopList/ShopList";
import Layout from "@/components/layout/Layout";
import FilterShopBox from "@/components/shop/FilterShopBox";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ShopCardList from "@/components/shop/ShopCardList";
import { useFetchProductsQuery } from "@/features/api/productApi";
import { useState } from "react";
export default function Shop2() {
  // const [activeIndex, setActiveIndex] = useState(2)
  // const handleOnClick = (index) => {
  //     setActiveIndex(index)
  // }
  const { data: products, error, isLoading } = useFetchProductsQuery();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Shop">
        <div className="product-area pt-70 pb-20">
          <div className="container">
            <div className="row">
              {/* <div className="col-lg-10 col-md-12">
                                <div className="product-sidebar__product-item">
                                    <FilterShopBox itemStart={10} itemEnd={18} />
                                </div>
                            </div> */}
              {/* <div className="col-lg-2 col-md-12">
                                <div className="tpsidebar product-sidebar__product-category">
                                    <FilterSidebar />
                                </div>
                            </div> */}

              {/* Products page */}
              <div className="custom-main-product">
              {products.map((item) => (
                <ShopList thumb1={item.productImage[0]} thumb2={item.productImage[1]} id={item._id} name={item.productName} description={item.productDescription} price={item.productPrice} category={item.productCategory} type={item.productType} brand={item.productBrand} />
                
              ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
