import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search, History } from 'lucide-react';

const HISTORY_KEY = 'jvr_search_history';

const readHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
};

export default function AdvancedSearchSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setSearchHistory(readHistory());
    inputRef.current?.focus();
    if (trendingSearches.length === 0) {
      fetch('/api/search/suggestions')
        .then((res) => (res.ok ? res.json() : { words: [] }))
        .then((data) => setTrendingSearches(data.words || []))
        .catch(() => {});
    }
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch search results with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const controller = new AbortController();
    const debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?searchQuery=${encodeURIComponent(searchQuery.trim())}`, {
          signal: controller.signal,
        });
        const data = res.ok ? await res.json() : { products: [] };
        setSearchResults((data.products || []).slice(0, 8));
      } catch (error) {
        if (error.name !== 'AbortError') setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchQuery]);

  const saveHistory = (term) => {
    const next = [term, ...searchHistory.filter((item) => item !== term)].slice(0, 5);
    setSearchHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private mode) — history just won't persist
    }
  };

  const goTo = (href) => {
    onClose();
    router.push(href);
  };

  const handleSearch = () => {
    const term = searchQuery.trim();
    if (!term) return;
    saveHistory(term);
    goTo(`/shop-2?search=${encodeURIComponent(term)}`);
  };

  return (
    <>
      {/* Overlay */}
      <div className={`jvr-search-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      {/* Sidebar */}
      <aside className={`jvr-search ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="jvr-search__header">
          <h4>Search</h4>
          <button onClick={onClose} aria-label="Close search"><X size={20} /></button>
        </div>

        <div className="jvr-search__box">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search shirts, sarees, kidswear…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} aria-label="Search">
            <Search size={18} />
          </button>
        </div>

        <div className="jvr-search__body">
          {searchQuery.trim() && (
            <div className="jvr-search__section">
              <div className="jvr-search__title">
                {isSearching ? 'Searching…' : `${searchResults.length ? 'Products' : 'No products found'}`}
              </div>
              <ul className="jvr-search__results">
                {searchResults.map((product) => (
                  <li key={product._id}>
                    <button onClick={() => goTo(`/ShopDetails/${product._id}`)}>
                      <img
                        src={product.productVariants?.[0]?.images?.[0] || '/assets/img/no-image.svg'}
                        alt=""
                        loading="lazy"
                      />
                      <span>
                        <strong>{product.productName}</strong>
                        <small>₹{product.productPrice}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {searchResults.length > 0 && (
                <button className="jvr-search__all" onClick={handleSearch}>
                  View all results for “{searchQuery.trim()}”
                </button>
              )}
            </div>
          )}

          {!searchQuery.trim() && searchHistory.length > 0 && (
            <div className="jvr-search__section">
              <div className="jvr-search__title">
                <History size={16} />
                <span>Recent Searches</span>
              </div>
              <ul className="jvr-search__list">
                {searchHistory.map((item) => (
                  <li key={item}>
                    <button onClick={() => setSearchQuery(item)}>{item}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!searchQuery.trim() && trendingSearches.length > 0 && (
            <div className="jvr-search__section">
              <div className="jvr-search__title">Popular Categories</div>
              <div className="jvr-search__tags">
                {trendingSearches.map((item) => (
                  <button key={item} onClick={() => goTo(`/shop-2?category=${encodeURIComponent(item)}`)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
