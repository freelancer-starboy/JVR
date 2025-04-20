"use client";
import { useRelatedProductsQuery } from "@/features/api/productApi";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MobileMenu() {
  const [isActive, setIsActive] = useState({
    status: false,
    key: "",
  });

  const [userData, setUserData] = useState(null); // User data
  const [productCategories, setProductCategories] = useState([]); // Product categories
  const [loading, setLoading] = useState(true); // Loading state



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
  // Fetch user data and product categories when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch("/api/user");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserData(userData);
        }

        // Fetch product categories
        const categoriesResponse = await fetch("/api/categories");
        if (categoriesResponse.ok) {
          const categories = await categoriesResponse.json();
          setProductCategories(categories);
        }

        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        setUserData(null); // Clear user data after logout
        console.log("User logged out successfully");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Check if the user is logged in
  const isLoggedIn = userData !== null;

  // Check if the data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mobile-menu mean-container">
      <div className="mean-bar">
        <Link href="#" className="meanmenu-reveal">
          <span>
            <span>
              <span />
            </span>
          </span>
        </Link>
        <nav className="mean-nav">
          <ul>
            <li>
              <Link href="/" >Home</Link>
            </li>
            <li>
              <Link href="/shop-2">Shop</Link>
            </li>

            {/* Dynamic Product Categories */}
            <li className="has-dropdown">
              <Link href="/shop-2">Products</Link>
              <ul
                className="submenu"
                style={{ display: isActive.key === 2 ? "block" : "none" }}
              >
                  <li className="has-dropdown">
                    <Link href="/shop-2?category=mens">Mens</Link>
                    
                  </li>
                  <li className="has-dropdown">
                    <Link href="/shop-2?category=women">Women</Link>
                    
                  </li>
                  <li className="has-dropdown">
                    <Link href="/shop-2?category=kids">Kids</Link>
                    
                  </li>
              </ul>
              <Link
                className="mean-expand"
                onClick={() => setIsActive({ status: !isActive.status, key: 2 })}
                href="#"
                style={{ fontSize: 12 }}
              >
                <i className="fal fa-plus" />
              </Link>
            </li>

            {/* User Profile and Logout */}
            {isLoggedIn && userData && (
              <li
                className="profile-container"
                onMouseEnter={() => setIsActive({ ...isActive, key: 4 })}
                onMouseLeave={() => setIsActive({ ...isActive, key: "" })}
              >
                <Link href="#" >
                  <i className="fal fa-user" />
                  {userData.name || "User"}
                </Link>

                {isActive.key === 4 && (
                  <div className="dropdown-menu show">
                    <button onClick={handleLogout} className="dropdown-item d-flex align-items-center">
                      <i className="fal fa-sign-out mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}

            {/* Contact Link */}
            <li className="mean-last">
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
