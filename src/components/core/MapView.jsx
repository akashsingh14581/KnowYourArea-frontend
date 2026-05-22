import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  Polyline, MapContainer, TileLayer, Marker, Popup, Circle, useMap,
} from "react-leaflet";
import { lazy, Suspense } from "react";

const Sidebar = lazy(() => import("./Sidebar"));
const ChangeMapCenter = lazy(() => import("./ChangeMapCenter"));

import { getShops } from "../../services/shopServices";
import getDistance from "../../utils/getDistance";
import { getRoute } from "../../utils/getRoute";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/Map.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Cache for distance calculations
const distanceCache = new Map();

/* ── Icons ── */
const makeIcon = (color, pulse = false) =>
  L.divIcon({
    className: "",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        ${pulse ? `<div style="
          position:absolute;width:36px;height:36px;border-radius:50%;
          background:${color};opacity:0.25;
          animation:markerPulse 2s ease-out infinite;
        "></div>` : ""}
        <div style="
          width:14px;height:14px;border-radius:50%;
          background:${color};border:2.5px solid #fff;
          box-shadow:0 2px 8px rgba(0,0,0,0.4);
        "></div>
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:48px;height:48px;border-radius:50%;
        background:rgba(59,130,246,0.2);animation:markerPulse 2s infinite;"></div>
      <div style="width:16px;height:16px;border-radius:50%;
        background:#3b82f6;border:3px solid #fff;"></div>
    </div>`,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

const openIcon   = makeIcon("#22c55e", true);
const closedIcon = makeIcon("#ef4444");

function MapDragHandler({ onMoveEnd }) {
  const map = useMap();
  useEffect(() => {
    let timer;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const { lat, lng } = map.getCenter();
        onMoveEnd([lat, lng]);
      }, 800);
    };
    map.on("moveend", handler);
    return () => { map.off("moveend", handler); clearTimeout(timer); };
  }, [map, onMoveEnd]);
  return null;
}

function PopupOpener({ selectedShop, markersRef }) {
  const map = useMap();
  
  useEffect(() => {
    if (!selectedShop || !markersRef.current) return;
    
    const timer = setTimeout(() => {
      const markerRef = markersRef.current.get(selectedShop._id || selectedShop.id);
      if (markerRef) {
        markerRef.openPopup();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedShop, markersRef, map]);
  
  return null;
}

function MapView() {
  const { isDark } = useTheme();

  const [shops, setShops]               = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchTerm, setSearchTerm]     = useState("");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [radius, setRadius]             = useState(1000);
  const [mapCenter, setMapCenter]       = useState(null);
  const [route, setRoute]               = useState([]);

  const [locationReady, setLocationReady] = useState(false);
  const [shopsLoading, setShopsLoading]   = useState(false);

  const mapRef = useRef(null);
  const markersRef = useRef(new Map());

  /* ── User location ── */
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation([28.6139, 77.209]);
      setLocationReady(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocationReady(true);
      },
      () => {
        setUserLocation([28.6139, 77.209]);
        setLocationReady(true);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("Watch error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* ── Fetch shops based on location/mapCenter ── */
  const locationForFetch = mapCenter || userLocation;

  useEffect(() => {
    if (!locationForFetch) return;

    const fetchShops = async () => {
      setShopsLoading(true);
      try {
        const data = await getShops({
          lat: locationForFetch[0],
          lng: locationForFetch[1],
          radius: radius / 1000,
        });
        setShops(Array.isArray(data.shops) ? data.shops : []);
      } catch (e) {
        console.warn("Shops fetch error:", e);
        setShops([]);
      } finally {
        setShopsLoading(false);
      }
    };

    const timer = setTimeout(fetchShops, 800);
    return () => clearTimeout(timer);
  }, [locationForFetch, radius]);

  /* ── Route fetch ── */
  useEffect(() => {
    if (!userLocation || !selectedShop) {
      setRoute([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const data = await getRoute(userLocation, selectedShop.position);
        setRoute(data);
      } catch (e) {
        console.warn("Route error:", e);
        setRoute([]);
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [selectedShop, userLocation]);

  const handleShopSelect = useCallback((shop) => {
    setSelectedShop(shop);
  }, []);

  const normalizedShops = useMemo(() =>
    shops.map((s) => ({
      ...s,
      position: s.location?.coordinates
        ? [s.location.coordinates[1], s.location.coordinates[0]]
        : [s.latitude, s.longitude],
    })),
    [shops]
  );

  // Optimized distance calculation with caching
  const getDistanceCached = useCallback((lat1, lon1, lat2, lon2, unit = "m") => {
    const key = `${lat1},${lon1},${lat2},${lon2}`;
    
    if (distanceCache.has(key)) {
      return distanceCache.get(key);
    }
    
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let d = R * c;
    
    if (unit === "km") d /= 1000;
    
    if (distanceCache.size > 1000) {
      const firstKey = distanceCache.keys().next().value;
      distanceCache.delete(firstKey);
    }
    
    distanceCache.set(key, d);
    return d;
  }, []);

  const filteredShops = useMemo(() => {
    if (!userLocation) return [];
    const term = (searchTerm || "").toLowerCase();

    return normalizedShops.filter((shop) => {
      const matchesSearch =
        (shop.name || "").toLowerCase().includes(term) ||
        (shop.category?.name || "").toLowerCase().includes(term) ||
        (shop.tags || []).some((tag) => tag.toLowerCase().includes(term));

      const matchesOpen = showOpenOnly ? shop.isOpen : true;

      return matchesSearch && matchesOpen;
    });
  }, [normalizedShops, searchTerm, showOpenOnly, userLocation]);

  const currentCenter = selectedShop?.position || userLocation;

  // ✅ OPTIMIZED: Remove @2x from tiles for better performance
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"  // Removed @2x
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  if (!locationReady) {
    return (
      <div className="map-loading" role="status" aria-label="Loading location">
        <div className="map-loading-spinner" aria-hidden="true" />
        <p>Detecting your location…</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes markerPulse {
          0%   { transform: scale(0.8); opacity: 0.6; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        
        /* Accessibility improvements */
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        button:focus-visible,
        [role="button"]:focus-visible,
        a:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="map-page">
        <Suspense fallback={<div className="map-loading-spinner" aria-label="Loading sidebar" />}>
          <Sidebar
            filteredShops={filteredShops}
            userLocation={userLocation}
            setSelectedShop={handleShopSelect}
            selectedShop={selectedShop}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showOpenOnly={showOpenOnly}
            setShowOpenOnly={setShowOpenOnly}
            radius={radius}
            setRadius={setRadius}
            shopsLoading={shopsLoading}
          />
        </Suspense>

        <div className="map-container">
          <MapContainer
            ref={mapRef}
            center={currentCenter}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer 
              url={tileUrl}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            />
            <ChangeMapCenter center={currentCenter} />
            <MapDragHandler onMoveEnd={(c) => setMapCenter(c)} />
            <PopupOpener selectedShop={selectedShop} markersRef={markersRef} />
            
            <Circle
              center={userLocation}
              radius={radius}
              pathOptions={{ color: "#3b82f6", fillOpacity: 0.06 }}
            />

            <Marker position={userLocation} icon={userIcon}>
              <Popup>You are here 📍</Popup>
            </Marker>

            {route.length > 0 && (
              <Polyline
                positions={route}
                pathOptions={{ color: "#3b82f6", weight: 4 }}
              />
            )}

            {filteredShops.map((shop) => {
              const dist = getDistanceCached(
                userLocation[0], userLocation[1],
                shop.position[0], shop.position[1],
                "m"
              );
              const distStr = dist < 1000
                ? `${Math.round(dist)} m away`
                : `${(dist / 1000).toFixed(1)} km away`;

              return (
                <Marker
                  key={shop._id || shop.id}
                  position={shop.position}
                  icon={shop.isOpen ? openIcon : closedIcon}
                  ref={(ref) => {
                    if (ref) {
                      markersRef.current.set(shop._id || shop.id, ref);
                    }
                  }}
                  eventHandlers={{
                    click: () => handleShopSelect(shop),
                  }}
                  aria-label={`Shop: ${shop.name}, ${shop.isOpen ? 'Open' : 'Closed'}`}
                >
                  <Popup className="shop-popup" maxWidth={220}>
                    {shop.image && (
                      <img 
                        src={shop.image} 
                        alt={shop.name} 
                        className="popup-img"
                        loading="lazy"
                      />
                    )}
                    <div className="popup-body">
                      <div className="popup-top">
                        <span className="popup-name">{shop.name}</span>
                        <span className={`popup-status ${shop.isOpen ? "sb-open" : "sb-closed"}`}>
                          {shop.isOpen ? "Open" : "Closed"}
                        </span>
                      </div>
                      <div className="popup-dist">📍 {distStr}</div>
                      {shop.category?.name && (
                        <div className="popup-category">🏷️ {shop.category.name}</div>
                      )}
                      {shop.tags?.length > 0 && (
                        <div className="popup-tags">
                          {shop.tags.map((tag) => (
                            <span key={tag} className="popup-tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </>
  );
}

export default MapView;