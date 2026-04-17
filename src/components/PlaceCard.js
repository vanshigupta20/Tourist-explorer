// src/components/PlaceCard.js
import React, { useState } from "react";

function PlaceCard({ place, onSave, savedPlaces = [] }) {
  const isSaved = savedPlaces.some((p) => p.name === place.name);
  const [showModal, setShowModal] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    onSave(place);
  };

  const getCategoryIcon = (category) => {
    if (!category) return "📍";
    const cat = category.toLowerCase();
    if (cat.includes("beach") || cat.includes("coast")) return "🏖";
    if (cat.includes("mountain") || cat.includes("hill")) return "🏔";
    if (cat.includes("historic") || cat.includes("heritage") || cat.includes("fort")) return "🏛";
    if (cat.includes("religion") || cat.includes("temple") || cat.includes("mosque") || cat.includes("church")) return "🛕";
    if (cat.includes("natural") || cat.includes("nature") || cat.includes("forest")) return "🌿";
    if (cat.includes("museum")) return "🏛";
    if (cat.includes("park")) return "🌳";
    if (cat.includes("waterfall")) return "💧";
    if (cat.includes("lake") || cat.includes("river")) return "🏞";
    return "📍";
  };

  return (
    <>
      <div className="card" onClick={() => setShowModal(true)}>
        <div className="card-image-wrapper">
          <img
            src={place.image}
            alt={place.name}
            onError={(e) => {
              e.target.src = `https://source.unsplash.com/400x300/?${encodeURIComponent(place.name + " india tourism")}`;
            }}
          />
          <div className="card-category-badge">
            {getCategoryIcon(place.category)} {place.category || "Place"}
          </div>
        </div>
        <div className="card-body">
          <h3>{place.name}</h3>
          {place.description && (
            <p className="card-description">{place.description}</p>
          )}
          <div className="card-buttons">
            <button
              className={`save-btn ${isSaved ? "saved" : ""}`}
              onClick={handleSave}
              title={isSaved ? "Remove from favorites" : "Save to favorites"}
            >
              {isSaved ? "❤️ Saved" : "🤍 Save"}
            </button>
            <button className="view-btn" onClick={(e) => { e.stopPropagation(); setShowModal(true); }}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <img
              src={place.image}
              alt={place.name}
              onError={(e) => {
                e.target.src = `https://source.unsplash.com/600x400/?${encodeURIComponent(place.name + " tourism")}`;
              }}
            />
            <div className="modal-content">
              <h2>{place.name}</h2>
              <p className="modal-category">
                {getCategoryIcon(place.category)} {place.category || "Tourist Place"}
              </p>
              {place.description && <p>{place.description}</p>}
              {place.address && <p>📍 {place.address}</p>}
              <button
                className={`save-btn full-width ${isSaved ? "saved" : ""}`}
                onClick={handleSave}
              >
                {isSaved ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlaceCard;