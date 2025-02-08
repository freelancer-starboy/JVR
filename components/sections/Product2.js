'use client'
import Link from "next/link";
import RelatedProducts from "../relatedProducts/RelatedProducts";

export default function Product2() {
  
  return (
    <>
      <section className="product-area pb-65">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4">
              <div className="tpsection mb-40">
                <h4 className="tpsection__title">Popular Products</h4>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="tpproductnav tpnavbar"></div>
            </div>
            <div className="col-lg-4 col-md-2">
              <div className="tpproductall">
                <Link href="/shop-2">
                  View All
                  <i className="far fa-long-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
          <div>
            <RelatedProducts category="" />
          </div>
        </div>
      </section>
    </>
  );
}
