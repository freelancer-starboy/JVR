'use client'
import { useRelatedProductsQuery } from "@/features/api/productApi";
import Link from "next/link";
import { useState, useEffect} from 'react'


export default function Banner1() {
    const [menCategory, setMenCategory] = useState(null);
    const [womenCategory, setWomenCategory] = useState(null);
    const [kidsCategory, setKidsCategory] = useState(null);
  
    const { data: mens } = useRelatedProductsQuery("mens");
    const { data: women } = useRelatedProductsQuery("women");
    const { data: kids } = useRelatedProductsQuery("kids");
  
    useEffect(() => {
      if (mens && women && kids) {
        setMenCategory(mens);
        setWomenCategory(women);
        setKidsCategory(kids);
        console.log("men category : ", mens);
      }
    }, [mens, women, kids]);
    return (
        <section className="banner-area pt-50  pb-95">
            <div className="container">
                <div className="row g-3"> {/* g-3 adds gap between columns */}
                    <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                        <div className="banneritem__thumb banner-animation text-center p-relative">
                            <img src="/assets/img/banner/men-1.jpg" alt="" />
                            <div className="banneritem__content">
                                <Link href={`/shop-2?category=mens`}><i className="far fa-long-arrow-right" /></Link>
                                <p>{menCategory?.length} Items</p>
                                <h4 className="banneritem__content-tiele"><Link href="/shop">Mens</Link></h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                        <div className="banneritem__thumb banner-animation text-center p-relative">
                            <img src="/assets/img/banner/women.jpg" alt="" />
                            <div className="banneritem__content">
                                <Link href={`/shop-2?category=women`}><i className="far fa-long-arrow-right" /></Link>
                                <p>{womenCategory?.length} Items</p>
                                <h4 className="banneritem__content-tiele"><Link href="/shop">Women</Link></h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                        <div className="banneritem__thumb banner-animation text-center p-relative">
                            <img src="/assets/img/banner/kids.jpg" alt="" />
                            <div className="banneritem__content">
                                <Link href={`/shop-2?category=kids`}><i className="far fa-long-arrow-right" /></Link>
                                <p>{kidsCategory?.length} Items</p>
                                <h4 className="banneritem__content-tiele"><Link href="/shop">Kids</Link></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
