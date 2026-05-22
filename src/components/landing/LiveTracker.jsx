import { TICKER_SHOPS } from "../../data/landingData";

function LiveTicker() {
  /* Duplicate for seamless infinite scroll */
  const items = [...TICKER_SHOPS, ...TICKER_SHOPS];

  return (
    <div className="ticker-bar">
      <div className="ticker-label">🔴 Live Shops</div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {items.map((s, i) => (
            <div key={i} className="tick-item">
              <span className="tick-name">{s.name}</span>
              <span className="tick-area">{s.area}</span>
              <span className={`tick-badge ${s.open ? "open" : "closed"}`}>
                {s.open ? "Open" : "Closed"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveTicker;