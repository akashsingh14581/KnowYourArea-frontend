import { useState, useRef, useEffect, useCallback } from "react";
import getDistance from "../../utils/getDistance";
import SearchFilter from "./SearchFilter";

/* ── Lazy Card — sirf tab render hoga jab screen pe visible hoga ── */
function LazyShopCard({ shop, isSelected, userLocation, onClick }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dist =
    userLocation && shop.position
      ? getDistance(
          userLocation[0], userLocation[1],
          shop.position[0], shop.position[1],
          "m"
        )
      : null;

  return (
    <div
      ref={ref}
      className={`sb-card${isSelected ? " sb-card-selected" : ""}`}
      onClick={() => onClick(shop)}
      role="button"
      tabIndex={0}
      aria-label={`Shop: ${shop.name}, ${shop.isOpen ? 'Open' : 'Closed'}, ${dist !== null ? (dist < 1000 ? `${Math.round(dist)} meters away` : `${(dist / 1000).toFixed(1)} kilometers away`) : 'distance unknown'}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(shop);
        }
      }}
    >
      {visible ? (
        <>
          <div className="sb-card-top">
            <h2 className="sb-shop-name">{shop.name}</h2>
            <span className={`sb-status ${shop.isOpen ? "sb-open" : "sb-closed"}`}>
              {shop.isOpen ? "Open" : "Closed"}
            </span>
          </div>
          {shop.category?.name && (
            <div className="sb-card-category">🏷️ {shop.category.name}</div>
          )}
          <div className="sb-card-bottom">
            <div className="sb-dist">
              <span className="sb-dist-dot" />
              {dist !== null
                ? dist < 1000
                  ? `${Math.round(dist)} m away`
                  : `${(dist / 1000).toFixed(1)} km away`
                : "Location loading..."}
            </div>
            <span className="sb-arrow">→</span>
          </div>
        </>
      ) : (
        <div className="sb-card-skeleton">
          <div className="sb-skeleton-line sb-skeleton-wide" />
          <div className="sb-skeleton-line sb-skeleton-narrow" />
        </div>
      )}
    </div>
  );
}

/* ── Main Sidebar ── */
function Sidebar({
  filteredShops = [],
  userLocation,
  setSelectedShop,
  selectedShop,
  searchTerm,
  setSearchTerm,
  showOpenOnly,
  setShowOpenOnly,
  radius,
  setRadius,
  shopsLoading = false,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openSidebar  = () => setMobileOpen(true);
  const closeSidebar = () => setMobileOpen(false);

  const handleShopClick = useCallback((shop) => {
    setSelectedShop(shop);
    // ✅ Mobile par sidebar close karo, but desktop par nahi
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }, [setSelectedShop]);

  return (
    <>
      {/* FAB — mobile only */}
      <button 
        className="sb-fab" 
        onClick={openSidebar} 
        aria-label="Open shop list"
        aria-expanded={mobileOpen}
      >
        🏪
      </button>

      {/* Overlay — mobile only */}
      {mobileOpen && <div className="sb-overlay" onClick={closeSidebar} aria-hidden="true" />}

      {/* Sidebar */}
      <div 
        className={`sb-sidebar${mobileOpen ? " sb-sidebar-open" : ""}`}
        aria-label="Shop list sidebar"
        role="complementary"
      >

        {/* Header */}
        <div className="sb-header">
          <div className="sb-title-row">
            <h1 className="sb-title" id="sidebar-title">Nearby Shops</h1>
            <div className="sb-title-right">
              <div className="sb-count" aria-live="polite">
                {shopsLoading ? "Loading…" : `${filteredShops.length} found`}
              </div>
              <button 
                className="sb-close" 
                onClick={closeSidebar} 
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>
          </div>

          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showOpenOnly={showOpenOnly}
            setShowOpenOnly={setShowOpenOnly}
          />

          {/* ✅ Radius slider with accessibility */}
          <div className="sb-radius">
            <div className="sb-radius-top">
              <label htmlFor="radius-slider" className="sb-radius-label">
                Search Radius
              </label>
              <strong aria-live="polite">
                {radius < 1000
                  ? `${radius} m`
                  : `${(radius / 1000).toFixed(1)} km`}
              </strong>
            </div>
            <input
              id="radius-slider"
              type="range"
              min="100"
              max="5000"
              step="100"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              aria-label={`Search radius ${radius < 1000 ? radius + ' meters' : (radius / 1000).toFixed(1) + ' kilometers'}`}
              aria-valuemin={100}
              aria-valuemax={5000}
              aria-valuenow={radius}
            />
          </div>
        </div>

        {/* Shop List */}
        <div 
          className="sb-list" 
          role="list" 
          aria-label="Shop listings"
          aria-busy={shopsLoading}
        >
          {/* Loading state */}
          {shopsLoading && (
            <div className="sb-loading-row" role="status">
              <div className="sb-loading-spinner" aria-hidden="true" />
              <span>Fetching nearby shops…</span>
            </div>
          )}

          {/* Empty state */}
          {!shopsLoading && filteredShops.length === 0 && (
            <div className="sb-empty" role="status">
              <div className="sb-empty-icon">🔍</div>
              <p>No shops found</p>
              <span>Try changing your search or radius</span>
            </div>
          )}

          {/* Cards — Intersection Observer se lazy load */}
          {!shopsLoading &&
            filteredShops.map((shop) => {
              const isSelected =
                selectedShop?._id === shop._id ||
                selectedShop?.id  === shop.id;

              return (
                <LazyShopCard
                  key={shop._id || shop.id}
                  shop={shop}
                  isSelected={isSelected}
                  userLocation={userLocation}
                  onClick={handleShopClick}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Sidebar;