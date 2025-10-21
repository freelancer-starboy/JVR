'use client';
import Link from 'next/link';
import RelatedProducts from '../relatedProducts/RelatedProducts';

export default function Product2() {
  return (
    <>
      <section className="product-area pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 text-center">
              <div className="tpsection mb-8">
                <h4 className="tpsection__title mt-10 inline-block hover:text-black transition-all duration-300 text-2xl font-semibold">
                  Popular Products
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="container mx-auto px-4 mt-8">
          <RelatedProducts category="mens" />
        </div>
      </section>
    </>
  );
}
