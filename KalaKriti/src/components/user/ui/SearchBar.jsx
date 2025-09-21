import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({
  onSearch,
  onVisualSearchClick,
  placeholder = "Search...",
  initialValue = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleVisualSearchClick = () => {
    if (onVisualSearchClick) {
      onVisualSearchClick();
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
        />

        <button
          type="button"
          className="visual-search-btn"
          onClick={handleVisualSearchClick}
          title="Search by image"
        >
          📸
        </button>

        <button
          type="submit"
          className="search-btn"
          disabled={!searchQuery.trim()}
        >
          🔍
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
