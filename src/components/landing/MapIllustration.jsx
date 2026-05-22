import { useEffect, useState } from "react";

const SHOPS = [
  { label: "Sharma Kirana", top: "12%", left: "16%", open: true,  delay: "0.55s" },
  { label: "Medical Store", top: "16%", left: "57%", open: true,  delay: "0.70s" },
  { label: "Tailor Shop",   top: "56%", left: "66%", open: false, delay: "0.85s" },
  { label: "Chai Point",    top: "65%", left: "20%", open: true,  delay: "1.00s" },
  { label: "Electronics",   top: "32%", left: "5%", open: true,  delay: "1.15s" },
];

function MapIllustration() {
  const [shopCount, setShopCount] = useState(12);

  /* Live ticker — count fluctuates to simulate real-time */
  useEffect(() => {
    let dir = 1;
    const id = setInterval(() => {
      setShopCount((prev) => {
        const next = prev + dir;
        if (next >= 16 || next <= 10) dir *= -1;
        return next;
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="map-card">
      {/* Title bar */}
      <div className="map-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="win-dots">
            <span className="dot dr" /><span className="dot dy" /><span className="dot dg" />
          </div>
          <span className="map-bar-title">Live Map — Gurugram</span>
        </div>
        <div className="live-pill">
          <span className="live-dot" />
          Live
        </div>
      </div>

      {/* Map body */}
      <div className="map-body">
        {/* Grid roads */}
        <div className="road rh" style={{ top: "32%" }} />
        <div className="road rh" style={{ top: "65%" }} />
        <div className="road rv" style={{ left: "30%" }} />
        <div className="road rv" style={{ left: "65%" }} />

        {/* You pin */}
        <div className="you-pin" style={{ top: "41%", left: "44%" }}>
          <div className="you-bubble">📍 You</div>
        </div>

        {/* Shop pins */}
        {SHOPS.map((s) => (
          <div
            key={s.label}
            className="shop-pin"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          >
            <div className={`pin-bubble ${s.open ? "open" : "closed"}`}>
              {s.label}
            </div>
            <div className={`pin-tail ${s.open ? "open" : "closed"}`} />
            <div className={`pin-dot  ${s.open ? "open" : "closed"}`} />
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="map-footer">
        <div className="map-stat">
          <strong>{shopCount}</strong>&nbsp;shops nearby
        </div>
        <div className="map-stat">
          <strong>8</strong>&nbsp;open now
        </div>
        <div className="map-stat">
          <strong style={{ color: "var(--red2)" }}>4</strong>&nbsp;closed
        </div>
      </div>
    </div>
  );
}

export default MapIllustration;