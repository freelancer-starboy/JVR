import Link from "next/link";
import { useEffect, useState } from "react";
import CartShow from "../elements/CartShow";
import WishListShow from "../elements/WishListShow";
import SidebarSearch from "../SearchSidebar/Sidebar-Search";
import { useAuth } from "@/components/AuthContent/AuthContent";
import { signOut, getAuth } from "firebase/auth";
import { useDeleteTokenMutation } from "@/features/api/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  useSearchItemsQuery,
  useWordsSearchQuery,
} from "@/features/api/searchApi";

export default function HeaderMobSticky({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
}) {

  const { userId, userName } = useAuth(); // Ensure userName is part of Auth context
  const router = useRouter();
  const [isSearchSidebar, setIsSearchSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [deleteToken] = useDeleteTokenMutation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounce(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: searchItems } = useSearchItemsQuery(debounce, {
    skip: !debounce.trim(),
  });

  const { data: wordsSearch } = useWordsSearchQuery();

  const handleLogout = async () => {
    try {
      await deleteToken().unwrap();
      const auth = getAuth();
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const handleProductClick = (id) => {
    router.push(`/ShopDetails/${id}`);
    setIsSearchSidebar(false);
  };

  const handleSuggestionClick = (suggestion) => {
    router.push(`/shop-2?search=${encodeURIComponent(suggestion)}`);
    setIsSearchSidebar(false);
  };
  return (
    <>
      <div
        id="header-mob-sticky"
        className={`tp-md-lg-header d-md-none pt-20 pb-20  ${scroll ? "header-sticky" : ""
          }`}
      >
        <div className="all-section">
          <div className="d-flex align-items-center justify-content-between w-100">

            {/* Left: Menu + Logo */}
            <div className="d-flex align-items-center gap-3">
              {/* Menu Toggle */}
              <button className="tp-menu-toggle" onClick={handleMobileMenu}>
                <i className="far fa-bars" />
              </button>

              {/* Logo */}
              <div className="logo d-flex align-items-center" style={{ height: "3rem" }}>
                <Link href="/">
                  <img
                    src="/assets/css/images/jvr-logo-3.png"
                    alt="logo"
                    style={{ height: "3rem", width: "auto", display: "block" }}
                  />
                </Link>
              </div>
            </div>

            {/* Right: Cart + User */}
            <div className="col-lg-9 col-md-8 d-flex justify-content-end align-items-center">
              <div className="header-meta-info d-flex gap-3 align-items-center">
                {/* Search Icon */}
                <button
                  onClick={() => setIsSearchSidebar(true)}
                  className="btn-icon"
                  aria-label="Search"
                >
                  <i className="fal fa-search fs-5" />
                </button>

                <SidebarSearch
                  isOpen={isSearchSidebar}
                  onClose={() => setIsSearchSidebar(false)}
                  searchItems={searchItems}
                  wordsSearch={wordsSearch}
                  onProductClick={handleProductClick}
                  onSuggestionClick={handleSuggestionClick}
                />

                {/* Cart Icon */}
                <button
                  onClick={handleCartSidebar}
                  className="btn-icon position-relative"
                  aria-label="View cart"
                >
                  <i className="fal fa-shopping-cart fs-5" />
                  <CartShow />
                </button>

                {/* Profile / Auth */}
                {userId && userName ? (
                  <div className="user-dropdown position-relative">
                    <button className="btn-icon">
                      <i className="fal fa-user text-success fw-bold fs-5" />
                    </button>
                    <div className="user-dropdown-menu position-absolute">
                      <Link href="/user">My Account</Link>
                      <Link href="/myOrders">My Orders</Link>
                      <button onClick={handleLogout} className="logout-btns">
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/sign-in" className="btn-icon" aria-label="Sign In">
                    <i className="fal fa-user fs-5" />
                  </Link>
                )}

                {/* Wishlist Icon */}
                {/* <Link
                  href="/wishlist"
                  className="btn-icon position-relative"
                  aria-label="View wishlist"
                >
                  <i className="fal fa-heart fs-5" />
                  <WishListShow />
                </Link> */}
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
