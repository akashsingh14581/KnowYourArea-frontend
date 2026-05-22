import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../../data/landingData";
import MapIllustration from "./MapIllustration";

function Hero() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="ld-hero">
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      {/* Left content */}
      <div className="hero-left">
        <div className="hero-badge">
          <span className="badge-dot" />
          Live tracking active
        </div>

        <h1>
          Find shops near you
          <br />
          <span className="gradient-text">open right now</span>
        </h1>

        <p className="hero-sub">
          Discover nearby shops and real-time availability instantly. No more
          wasted trips.
        </p>

        {/* Search bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search shops, medicines, grocery…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        {/* Category filter chips */}
        <div className="categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              className={`cat-chip ${activeCategory === cat.label ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.label)}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hero-btns">
          <Link to="/map" className="btn-primary">
            🗺 Explore Map
          </Link>
          <Link to="/create-shop" className="btn-ghost">
            ＋ Add Shop
          </Link>
        </div>
      </div>

      {/* Right — map card */}
      <div className="hero-right">
        <MapIllustration />
      </div>
    </section>
  );
}

export default Hero;