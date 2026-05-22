import { useState } from "react";
import { toggleShopStatus } from "../../services/shopServices";
import "../../styles/ToggleStatus.css";

function ToggleStatus({ shop, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(shop.isOpen);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const data = await toggleShopStatus(shop._id);
      if (data.success) {
        setIsOpen(data.isOpen);
        onStatusChange?.(data.isOpen);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`toggle-btn ${isOpen ? "toggle-btn--open" : "toggle-btn--closed"} ${loading ? "toggle-btn--loading" : ""}`}
    >
      <span className="toggle-btn__dot" />
      <span className="toggle-btn__label">
        {loading ? "Updating..." : isOpen ? "Open" : "Closed"}
      </span>
    </button>
  );
}

export default ToggleStatus;