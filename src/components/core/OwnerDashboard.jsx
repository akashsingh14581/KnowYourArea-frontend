import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ToggleStatus from "../core/ToggleStatus";
import { getMyShops } from "../../services/shopServices";
import "../../styles/OwnerDashboard.css";

function OwnerDashboard() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getMyShops();
        setShops(data.shops);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  return (
    <div className="dashboard">

      {/* ── Header ── */}
      <div className="dashboard__header">
        <div>
          <h2 className="dashboard__title">My Shops</h2>
          <p className="dashboard__subtitle">
            {shops.length} shop{shops.length !== 1 ? "s" : ""} registered
          </p>
        </div>
      </div>

      {/* ── Skeleton loader ── */}
      {loading && (
        <div className="shop-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shop-skeleton" />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && shops.length === 0 && (
        <div className="dashboard__empty">
          <div className="dashboard__empty-icon">🏪</div>
          <p className="dashboard__empty-title">Koi shop nahi mili</p>
          <p className="dashboard__empty-sub">Apni pehli shop add karo</p>
        </div>
      )}

      {/* ── Shop grid ── */}
      {!loading && shops.length > 0 && (
        <div className="shop-grid">
          {shops.map((shop, i) => (
            <div
              key={shop._id}
              className="shop-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Image banner */}
              <div className="shop-card__img-wrap">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="shop-card__img"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=1d4ed8&color=fff&size=400`;
                  }}
                />

    

                {/* Category chip — top right */}
                {shop.category?.name && (
                  <span className="shop-card__cat">{shop.category.name}</span>
                )}
              </div>

              {/* Card body */}
              <div className="shop-card__body">
                <h3 className="shop-card__name">{shop.name}</h3>

                <div className="shop-card__meta">
                  <span className="shop-card__meta-item">
                    <span className="shop-card__meta-icon">📞</span>
                    {shop.mobileNumber}
                  </span>
                  {shop.tags?.length > 0 && (
                    <span className="shop-card__meta-item">
                      <span className="shop-card__meta-icon">🏷️</span>
                      {shop.tags.join(", ")}
                    </span>
                  )}
                </div>

                {/* Footer: toggle + date */}
                <div className="shop-card__footer">
                  <ToggleStatus
                    shop={shop}
                    onStatusChange={(newStatus) => {
                      setShops((prev) =>
                        prev.map((s) =>
                          s._id === shop._id
                            ? { ...s, isOpen: newStatus }
                            : s
                        )
                      );
                    }}
                  />
                  <span className="shop-card__date">
                    {new Date(shop.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;