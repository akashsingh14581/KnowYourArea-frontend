function SearchFilter({
  searchTerm,
  setSearchTerm,
  showOpenOnly,
  setShowOpenOnly,
}) {
  return (
    <div className="sf-wrap">

      {/* Search Input */}
      <div className="sf-search">
        <span className="sf-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search shops, tags, category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="sf-clear"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="sf-chips">
        <button
          className={`sf-chip${!showOpenOnly ? " sf-chip-active" : ""}`}
          onClick={() => setShowOpenOnly(false)}
        >
          All Shops
        </button>
        <button
          className={`sf-chip${showOpenOnly ? " sf-chip-active" : ""}`}
          onClick={() => setShowOpenOnly(true)}
        >
          Open Only 🟢
        </button>
      </div>

    </div>
  );
}

export default SearchFilter;