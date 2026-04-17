// src/components/Filters.js
import React, { useState } from "react";

const FILTERS = [
  { key: "all", label: "🌐 All" },
  { key: "beach", label: "🏖 Beaches" },
  { key: "mountain", label: "🏔 Hills" },
  { key: "historic", label: "🏛 Heritage" },
  { key: "religion", label: "🛕 Religious" },
  { key: "natural", label: "🌿 Nature" },
  { key: "museum", label: "🏛 Museums" },
  { key: "park", label: "🌳 Parks" },
];

function Filters({ onFilter }) {
  const [active, setActive] = useState("all");

  const handleFilter = (key) => {
    setActive(key);
    onFilter(key);
  };

  return (
    <div className="filters">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          className={active === key ? "filter-btn active" : "filter-btn"}
          onClick={() => handleFilter(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default Filters;