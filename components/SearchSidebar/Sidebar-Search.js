import { useState, useRef, useEffect } from 'react';
import { X, Search, History } from 'lucide-react';

export default function AdvancedSearchSidebar({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([
    'Cotton Shirts',
    'Summer Dress',
    'Kids Wear',
  ]);
  const [trendingSearches] = useState([
    'Winter Collection',
    'Ethnic Wear',
    'Casual Shirts',
    'Party Dresses',
  ]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch search results with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?searchQuery=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.details || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory([searchQuery, ...searchHistory.slice(0, 4)]);
      }
      console.log('Searching:', searchQuery);
      onClose();
    }
  };

  const handleHistoryClick = (item) => {
    setSearchQuery(item);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <h4>Search</h4>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        {/* Search Input */}
        <div className="search-box">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>
            <Search size={18} />
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="section">
            <div className="section-header">
              Search Results
            </div>
            <ul className="list">
              {searchResults.map((product) => (
                <li
                  key={product._id}
                  onClick={() => {
                    console.log('Clicked product:', product.productName);
                    // You can add navigation here e.g. router.push(`/product/${product._id}`)
                    onClose();
                  }}
                >
                  {product.productName}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* History */}
        {searchHistory.length > 0 && (
          <div className="section">
            <div className="section-header">
              <History size={16} />
              <span>Recent Searches</span>
            </div>
            <ul className="list">
              {searchHistory.map((item, i) => (
                <li key={i} onClick={() => handleHistoryClick(item)}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Trending */}
        <div className="section">
          <div className="section-header">
            <span>Trending</span>
          </div>
          <div className="tags">
            {trendingSearches.map((item, i) => (
              <button
                key={i}
                className="tag"
                onClick={() => setSearchQuery(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
        }
        .sidebar {
          position: fixed;
          top: 0; right: 0;
          width: 300px;
          height: 100%;
          background: #fff;
          box-shadow: -2px 0 8px rgba(0,0,0,0.1);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          padding: 16px;
        }
        .sidebar.open {
          transform: translateX(0);
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .search-box {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .search-box input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .search-box button {
          background: none;
          border: none;
          cursor: pointer;
        }
        .section {
          margin-bottom: 24px;
        }
        .section-header {
          font-weight: bold;
          margin-bottom: 8px;
        }
        .list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .list li {
          padding: 6px 0;
          cursor: pointer;
          color: #333;
        }
        .list li:hover {
          color: #007bff;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag {
          background: #f1f1f1;
          border: none;
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
        }
        .tag:hover {
          background: #e0e0e0;
        }
      `}</style>
    </>
  );
}
