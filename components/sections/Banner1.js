import Link from "next/link";

export default function Banner1() {
    return (
        <section className="banner-area pt-50  pb-95">
            <div className="container">
                <div className="row g-3"> {/* g-3 adds gap between columns */}
                    <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                        <div className="banneritem__thumb banner-animation text-center p-relative">
                            <img src="/assets/img/banner/men-1.jpg" alt="" />
                            <div className="banneritem__content">
                                <Link href="/shop-2"><i className="far fa-long-arrow-right" /></Link>
                                <p>19 Items</p>
                                <h4 className="banneritem__content-tiele"><Link href="/shop">Mens</Link></h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                        <div className="banneritem__thumb banner-animation text-center p-relative">
                            <img src="/assets/img/banner/women.jpg" alt="" />
                            <div className="banneritem__content">
                                <Link href="/shop-2"><i className="far fa-long-arrow-right" /></Link>
                                <p>22 Items</p>
                                <h4 className="banneritem__content-tiele"><Link href="/shop">Women</Link></h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                        <div className="banneritem__thumb banner-animation text-center p-relative">
                            <img src="/assets/img/banner/kids.jpg" alt="" />
                            <div className="banneritem__content">
                                <Link href="/shop-2"><i className="far fa-long-arrow-right" /></Link>
                                <p>30 Items</p>
                                <h4 className="banneritem__content-tiele"><Link href="/shop">Kids</Link></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
