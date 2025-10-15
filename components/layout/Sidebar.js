'use client'
import Link from "next/link"
import MobileMenu from "./MobileMenu"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useAuth } from "../AuthContent/AuthContent";
import { useEffect, useState, useRef } from "react";
import { useDeleteTokenMutation } from "@/features/api/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSearchItemsQuery, useWordsSearchQuery } from "@/features/api/searchApi";

export default function Sidebar({ isMobileMenu, handleMobileMenu }) {
  const { userId } = useAuth();
  const [userName, setUserName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'menu', 'categories'
  const [searchHistory, setSearchHistory] = useState([]);
  const router = useRouter();
  const auth = getAuth();
  const inputRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('searchHistory');
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && searchHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName);
      }
    });
    return () => unsubscribe();
  }, [userId, auth]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [deleteCookies] = useDeleteTokenMutation();

  const handleDeleteUser = async () => {
    try {
      await signOut(auth);
      const response = await deleteCookies().unwrap();
      if (response.success) {
        toast.success('Logout Successful');
        window.location.reload();
      } else {
        toast.error('Logout Failed');
      }
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  // Fetch search results
  const { data: searchItems } = useSearchItemsQuery(debouncedQuery, {
    skip: !debouncedQuery || debouncedQuery.trim() === "",
  });

  const { data: wordsSearch } = useWordsSearchQuery();

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim() !== '') {
      // Add to history
      const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);

      // Build query params
      const params = new URLSearchParams();
      params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (sortBy !== 'relevance') params.append('sort', sortBy);
      params.append('minPrice', priceRange[0]);
      params.append('maxPrice', priceRange[1]);

      router.push(`/shop-2?${params.toString()}`);
      handleMobileMenu(); // Close sidebar
    }
  };

  const handleProductClick = (id) => {
    router.push(`/ShopDetails/${id}`);
    handleMobileMenu();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    router.push(`/shop-2?search=${encodeURIComponent(suggestion)}`);
    handleMobileMenu();
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('searchHistory');
    }
  };

  const handleRemoveHistoryItem = (index, e) => {
    e.stopPropagation();
    setSearchHistory(searchHistory.filter((_, i) => i !== index));
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🛍️' },
    { id: 'mens', name: 'Mens Wear', icon: '👔' },
    { id: 'women', name: 'Women Wear', icon: '👗' },
    { id: 'kids', name: 'Kids Wear', icon: '👶' },
  ];

  const trendingSearches = wordsSearch?.words?.slice(0, 6) || [];
  const displayProducts = searchItems?.products?.slice(0, 5) || [];
  const displaySuggestions = searchItems?.wordSuggestions?.slice(0, 5) || [];

  return (
    <>
      <div className={`tpsideinfo ${isMobileMenu ? "tp-sidebar-opened" : ""}`}>
        <button className="tpsideinfo__close" onClick={handleMobileMenu}>
          Close<i className="fal fa-times ml-10" />
        </button>

        {/* Tab Navigation */}
        <div className="tpsideinfo__tabs pt-20 pb-20 border-bottom">
          <div className="d-flex justify-content-around">
            <button
              className={`btn btn-sm ${activeTab === 'search' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('search')}
            >
              <i className="fal fa-search me-1" />
              Search
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'menu' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('menu')}
            >
              <i className="fal fa-bars me-1" />
              Menu
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'categories' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('categories')}
            >
              <i className="fal fa-th me-1" />
              Categories
            </button>
          </div>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="tpsideinfo__search-content">
            <div className="tpsideinfo__search text-center pt-20">
              <span className="tpsideinfo__search-title mb-20">What Are You Looking For?</span>
              <form onSubmit={handleSearchSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search Products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit"><i className="fal fa-search" /></button>
              </form>

              {/* Quick Actions */}
              <div className="d-flex gap-2 mt-3 px-3">
                <button
                  className={`btn btn-sm flex-fill ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setShowFilters(!showFilters)}
                  style={{ fontSize: '12px' }}
                >
                  <i className="fal fa-filter me-1" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
                <button
                  className="btn btn-sm btn-primary flex-fill"
                  onClick={handleSearchSubmit}
                  style={{ fontSize: '12px' }}
                >
                  <i className="fal fa-search me-1" />
                  Search
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="px-3 py-3 mt-3 mx-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>
                    <i className="fal fa-sliders-h me-2" />
                    Filters
                  </h6>
                  <button
                    className="btn btn-link text-primary p-0 text-decoration-none"
                    style={{ fontSize: '11px' }}
                    onClick={() => {
                      setSelectedCategory('all');
                      setPriceRange([0, 5000]);
                      setSortBy('relevance');
                    }}
                  >
                    Clear All
                  </button>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '12px' }}>
                    <i className="fal fa-tags me-1" />
                    Category
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ fontSize: '12px' }}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '12px' }}>
                    <i className="fal fa-rupee-sign me-1" />
                    Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  />
                </div>

                {/* Sort */}
                <div className="mb-0">
                  <label className="form-label fw-semibold" style={{ fontSize: '12px' }}>
                    <i className="fal fa-sort me-1" />
                    Sort By
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ fontSize: '12px' }}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            )}

            {/* Live Search Results */}
            {debouncedQuery && (displaySuggestions.length > 0 || displayProducts.length > 0) && (
              <div className="px-3 py-3">
                <h6 className="fw-bold mb-3" style={{ fontSize: '14px' }}>
                  <i className="fal fa-lightbulb me-2 text-warning" />
                  Search Results
                </h6>

                {/* Suggestions */}
                {displaySuggestions.length > 0 && (
                  <div className="mb-3">
                    <div className="small fw-semibold text-muted mb-2">Suggestions</div>
                    {displaySuggestions.map((suggestion, index) => (
                      <div
                        key={`suggestion-${index}`}
                        className="d-flex align-items-center py-2 px-2 mb-1 rounded"
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: '#f8f9fa',
                          fontSize: '13px'
                        }}
                      >
                        <i className="fal fa-search me-2 text-secondary" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Products */}
                {displayProducts.length > 0 && (
                  <div>
                    <div className="small fw-semibold text-muted mb-2">Products</div>
                    {displayProducts.map((item) => (
                      <div
                        key={item._id}
                        className="d-flex align-items-center py-2 px-2 mb-2 rounded"
                        onClick={() => handleProductClick(item._id)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: '#f8f9fa'
                        }}
                      >
                        <img
                          src={item.productVariants?.[0]?.images?.[0]}
                          alt={item.productName}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginRight: '10px'
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold" style={{ fontSize: '13px' }}>
                            {item.productName}
                          </div>
                          {item.price && (
                            <div className="small text-muted">₹{item.price}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search History */}
            {!debouncedQuery && searchHistory.length > 0 && (
              <div className="px-3 py-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>
                    <i className="fal fa-history me-2 text-info" />
                    Recent
                  </h6>
                  <button
                    className="btn btn-link text-danger p-0 text-decoration-none"
                    style={{ fontSize: '11px' }}
                    onClick={handleClearHistory}
                  >
                    Clear
                  </button>
                </div>
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center justify-content-between py-2 px-2 mb-1 rounded"
                    onClick={() => {
                      setSearchQuery(item);
                      handleSearchSubmit();
                    }}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#f8f9fa',
                      fontSize: '13px'
                    }}
                  >
                    <span>
                      <i className="fal fa-clock me-2 text-muted" />
                      {item}
                    </span>
                    <i
                      className="fal fa-times text-muted"
                      onClick={(e) => handleRemoveHistoryItem(index, e)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {!debouncedQuery && trendingSearches.length > 0 && (
              <div className="px-3 py-3">
                <h6 className="mb-3 fw-bold" style={{ fontSize: '14px' }}>
                  <i className="fal fa-fire me-2 text-danger" />
                  Trending
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {trendingSearches.map((item, index) => (
                    <button
                      key={index}
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setSearchQuery(item);
                        handleSearchSubmit();
                      }}
                      style={{ borderRadius: '20px', fontSize: '11px' }}
                    >
                      <i className="fal fa-hashtag me-1" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="tpsideinfo__nabtab pt-20">
            <MobileMenu />
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="tpsidebar-categories pt-20 px-3">
            <h6 className="mb-3 fw-bold">
              <i className="fal fa-th-large me-2" />
              Shop by Category
            </h6>
            <ul>
              <li>
                <Link href="/shop-2?category=mens" onClick={handleMobileMenu}>
                  <i className="fal fa-tshirt me-2" />
                  Mens Wear
                </Link>
              </li>
              <li>
                <Link href="/shop-2?category=women" onClick={handleMobileMenu}>
                  <i className="fal fa-female me-2" />
                  Women Wear
                </Link>
              </li>
              <li>
                <Link href="/shop-2?shopCategory=kids" onClick={handleMobileMenu}>
                  <i className="fal fa-child me-2" />
                  Kids Wear
                </Link>
              </li>
              <li>
                <Link href="/track" onClick={handleMobileMenu}>
                  <i className="fal fa-map-marker-alt me-2" />
                  Track Product
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Footer Actions */}
        <div className="tpsideinfo__account-link">
          {userName ? (
            <>
              <p className="tpsideinfo__account-link-text" style={{ color: "white" }}>
                <i className="fal fa-user" />
                <span className="mx-2">{userName}</span>
              </p>
              <button style={{ color: "white" }} onClick={handleDeleteUser}>
                <i className="fal fa-sign-out me-2" />
                Logout
              </button>
            </>
          ) : (
            <Link href="/sign-in">
              <i className="fal fa-user" />
              Login / Register
            </Link>
          )}
        </div>
        {/* <div className="tpsideinfo__wishlist-link">
          <Link href="/wishlist" target="_parent">
            <i className="fal fa-heart" /> Wishlist
          </Link>
        </div> */}
      </div>
      <div className={`body-overlay ${isMobileMenu ? "opened" : ""}`} onClick={handleMobileMenu} />
    </>
  );
}