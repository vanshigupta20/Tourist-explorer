// src/components/PlacesList.js
import React from "react";
import PlaceCard from "./PlaceCard";

function PlacesList({ places, onSave, savedPlaces }) {
  if (!places || places.length === 0) {
    return (
      <div className="empty">
        <span>🗺️</span>
        <h2>No places found</h2>
        <p>Try searching a city like Delhi, Goa, Jaipur, or Mumbai</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {places.map((place, index) => (
        <PlaceCard
          key={`${place.name}-${index}`}
          place={place}
          onSave={onSave}
          savedPlaces={savedPlaces}
        />
      ))}
    </div>
  );
}

export default PlacesList;