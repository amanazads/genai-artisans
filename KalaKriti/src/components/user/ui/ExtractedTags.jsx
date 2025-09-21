import React, { useState } from "react";
import "./ExtractedTags.css";

const ExtractedTags = ({
  tags = [],
  searchQuery = "",
  onTagClick,
  onTagRemove,
  maxDisplayTags = 10,
  showRemoveAll = true,
  variant = "default", // "default", "filter", "search-result"
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = showAll ? tags : tags.slice(0, maxDisplayTags);
  const hasMoreTags = tags.length > maxDisplayTags;

  const handleTagClick = (tag) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  const handleTagRemove = (tag, event) => {
    event.stopPropagation();
    if (onTagRemove) {
      onTagRemove(tag);
    }
  };

  const removeAllTags = () => {
    if (onTagRemove) {
      tags.forEach((tag) => onTagRemove(tag));
    }
  };

  const getTagIcon = (tag) => {
    const tagLower = tag.toLowerCase();

    // Category icons
    if (tagLower.includes("pottery") || tagLower.includes("ceramic"))
      return "🏺";
    if (tagLower.includes("textile") || tagLower.includes("fabric"))
      return "🧵";
    if (tagLower.includes("jewelry") || tagLower.includes("jewellery"))
      return "💎";
    if (tagLower.includes("painting") || tagLower.includes("art")) return "🎨";
    if (tagLower.includes("sculpture") || tagLower.includes("carving"))
      return "🗿";
    if (tagLower.includes("wood") || tagLower.includes("wooden")) return "🪵";
    if (tagLower.includes("metal") || tagLower.includes("brass")) return "⚱️";
    if (tagLower.includes("leather")) return "🧳";
    if (tagLower.includes("glass")) return "🔮";

    // Attribute icons
    if (tagLower.includes("handmade") || tagLower.includes("hand-made"))
      return "👐";
    if (tagLower.includes("traditional")) return "🏛️";
    if (tagLower.includes("modern")) return "✨";
    if (tagLower.includes("vintage")) return "📿";
    if (tagLower.includes("eco") || tagLower.includes("sustainable"))
      return "🌱";
    if (tagLower.includes("premium") || tagLower.includes("luxury"))
      return "⭐";

    // Color icons
    if (tagLower.includes("red")) return "🔴";
    if (tagLower.includes("blue")) return "🔵";
    if (tagLower.includes("green")) return "🟢";
    if (tagLower.includes("yellow")) return "🟡";
    if (tagLower.includes("purple")) return "🟣";
    if (tagLower.includes("orange")) return "🟠";
    if (tagLower.includes("black")) return "⚫";
    if (tagLower.includes("white")) return "⚪";

    // Default
    return "🏷️";
  };

  const getTagType = (tag) => {
    const tagLower = tag.toLowerCase();

    if (
      [
        "pottery",
        "textile",
        "jewelry",
        "painting",
        "sculpture",
        "wood",
        "metal",
        "leather",
        "glass",
      ].some((cat) => tagLower.includes(cat))
    ) {
      return "category";
    }
    if (
      [
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
        "orange",
        "black",
        "white",
      ].some((color) => tagLower.includes(color))
    ) {
      return "color";
    }
    if (
      ["handmade", "traditional", "modern", "vintage", "eco", "premium"].some(
        (attr) => tagLower.includes(attr)
      )
    ) {
      return "attribute";
    }
    return "general";
  };

  return (
    <div className={`extracted-tags ${variant}`}>
      <div className="tags-header">
        <div className="tags-title">
          {variant === "search-result" && (
            <>
              <span className="tags-icon">🔍</span>
              <span>Search Tags {searchQuery && `for "${searchQuery}"`}</span>
            </>
          )}
          {variant === "filter" && (
            <>
              <span className="tags-icon">🏷️</span>
              <span>Applied Filters</span>
            </>
          )}
          {variant === "default" && (
            <>
              <span className="tags-icon">🏷️</span>
              <span>Tags</span>
            </>
          )}
          <span className="tags-count">({tags.length})</span>
        </div>

        {showRemoveAll && tags.length > 0 && onTagRemove && (
          <button
            className="remove-all-btn"
            onClick={removeAllTags}
            title="Remove all tags"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="tags-container">
        {displayTags.map((tag, index) => (
          <div
            key={`${tag}-${index}`}
            className={`tag-item ${getTagType(tag)} ${
              onTagClick ? "clickable" : ""
            }`}
            onClick={() => handleTagClick(tag)}
            title={`${tag}${onTagClick ? " - Click to search" : ""}`}
          >
            <span className="tag-icon">{getTagIcon(tag)}</span>
            <span className="tag-text">{tag}</span>
            {onTagRemove && (
              <button
                className="tag-remove"
                onClick={(e) => handleTagRemove(tag, e)}
                title={`Remove ${tag} tag`}
                aria-label={`Remove ${tag} tag`}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {hasMoreTags && (
          <button
            className="show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <span>Show Less</span>
                <span className="btn-icon">↑</span>
              </>
            ) : (
              <>
                <span>+{tags.length - maxDisplayTags} More</span>
                <span className="btn-icon">↓</span>
              </>
            )}
          </button>
        )}
      </div>

      {tags.length === 0 && variant === "filter" && (
        <div className="no-tags-message">
          <span className="no-tags-icon">🔍</span>
          <span>No filters applied</span>
        </div>
      )}
    </div>
  );
};

export default ExtractedTags;
