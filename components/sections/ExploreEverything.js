'use client'
import { Radius } from "lucide-react";
import { useRelatedProductsQuery } from "@/features/api/productApi";
import Link from "next/link";
import { useState, useEffect } from 'react'


export default function ExploreEverything() {
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

        <section className="product-area pb-65">
            <div className="container">
                {/* Header Section */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 text-center">
                        <div className="tpsection mb-40">
                            <h4 className="tpsection__title mt-40 inline-block border-b-2 border-transparent hover:border-black transition-all duration-300">
                                Explore Everything
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Cards */}
            <div className="container">
                <div className="row g-4 justify-content-center">
                    {/* MEN */}
                    <div className="col-lg-3 col-md-4 col-sm-4 col-4">
                        <div className="banneritem__thumb banner-animation text-center p-relative">
                            <img src="/assets/img/banner/men-1.jpg" alt="Men" style={{ borderRadius: "25px" }} />
                            <div className="banneritem__content">
                                <Link href={`/shop-2?category=mens`}><i className="far fa-long-arrow-right" /></Link>
                                <p>{menCategory?.length} Items</p>
                                <h4 className="banneritem__content-tiele"><Link href="/shop-2?category=mens" className="text-white text-decoration-none">Mens</Link></h4>
                            </div>
                        </div>
                    </div>

                    {/* WOMEN */}
                    <div className="col-lg-3 col-md-4 col-sm-4 col-4">
                        <div className="banneritem__thumb banner-animation text-center p-relative">
                            <img src="/assets/img/banner/women.jpg" alt="Women" style={{ borderRadius: "25px" }} />
                            <div className="banneritem__content">
                                <Link href={`/shop-2?category=women`}><i className="far fa-long-arrow-right" /></Link>
                                <p>{womenCategory?.length} Items</p>
                                <h4 className="banneritem__content-tiele hover-link"><Link href="/shop-2?category=women" className="text-white text-decoration-none">Women</Link></h4>
                            </div>
                        </div>
                    </div>

                    {/* KIDS */}
                    <div className="col-lg-3 col-md-4 col-sm-4 col-4">
                        <div className="banneritem__thumb banner-animation text-center p-relative">
                            <img src="/assets/img/banner/kids.jpg" alt="Kids" style={{ borderRadius: "25px" }} />
                            <div className="banneritem__content">
                                <Link href={`/shop-2?category=kids`}><i className="far fa-long-arrow-right" /></Link>
                                <p>{kidsCategory?.length} Items</p>
                                <h4 className="banneritem__content-tiele"><Link href="/shop-2?category=kids" className="text-white text-decoration-none">Kids</Link></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}   
