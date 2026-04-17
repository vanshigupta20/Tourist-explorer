// src/pages/Home.js
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import PlacesList from "../components/PlacesList";
import Loader from "../components/Loader";
import { fetchPlaces } from "../services/api";

const CATEGORY_KEYWORDS = {
  beach: ["beach", "coast", "sea", "ocean", "bay", "shore"],
  mountain: ["mountain", "hill", "peak", "valley", "trek", "ridge", "cliff"],
  historic: ["historic", "heritage", "fort", "palace", "monument", "ancient", "ruins", "castle", "memorial", "archaeological"],
  religion: ["religion", "temple", "mosque", "church", "shrine", "gurudwara", "mandir", "masjid", "chapel", "religious"],
  natural: ["natural", "nature", "forest", "wildlife", "garden", "jungle", "waterfall", "lake", "river", "reserve", "park"],
  museum: ["museum", "gallery", "art", "exhibition"],
  park: ["park", "garden", "reserve", "sanctuary"],
};

function matchesFilter(kinds, filterType) {
  if (!kinds) return false;
  const k = kinds.toLowerCase();
  return (CATEGORY_KEYWORDS[filterType] || []).some((kw) => k.includes(kw));
}

function Home() {
  const [places, setPlaces] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [searchedLocation, setSearchedLocation] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (location) => {
    if (!location) return;

    setLoading(true);
    setError("");
    setSearchedLocation(location);
    setPlaces([]);
    setFiltered([]);

    try {
      const data = await fetchPlaces(location);

      if (!data || data.length === 0) {
        setError(`No places found for "${location}". Try: Delhi, Goa, Jaipur, Agra, Mumbai, Varanasi.`);
      } else {
        setPlaces(data);
        setFiltered(data);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    }

    setLoading(false);
  };

  const handleFilter = (type) => {
    if (type === "all") { setFiltered(places); return; }
    const result = places.filter((p) => matchesFilter(p.kinds, type));
    setFiltered(result.length > 0 ? result : []);
  };

  const handleSave = (place) => {
    setSavedPlaces((prev) => {
      const exists = prev.some((p) => p.name === place.name);
      return exists ? prev.filter((p) => p.name !== place.name) : [...prev, place];
    });
  };

  const renderContent = () => {
    if (currentPage === "favorites") {
      return (
        <div>
          <div className="page-header">
            <h2>❤️ Your Favorites</h2>
            <p>{savedPlaces.length} place{savedPlaces.length !== 1 ? "s" : ""} saved</p>
          </div>
          {savedPlaces.length === 0 ? (
            <div className="empty">
              <span>💔</span>
              <h2>No favorites yet</h2>
              <p>Search for places and save the ones you love!</p>
            </div>
          ) : (
            <PlacesList places={savedPlaces} onSave={handleSave} savedPlaces={savedPlaces} />
          )}
        </div>
      );
    }

    if (currentPage === "about") {
      return (
        <div className="about-page">
          <h2>🌍 About Tourist Explorer</h2>
          <p>
            Tourist Explorer helps you discover amazing tourist destinations across
            India and the world. Search any city to instantly find top attractions,
            heritage sites, nature spots, and more — powered by OpenStreetMap data.
          </p>
          <div className="about-features">
            <div className="feature-card">🔍 <strong>Smart Search</strong><p>Find places by city name</p></div>
            <div className="feature-card">🗂 <strong>Category Filters</strong><p>Filter by type of place</p></div>
            <div className="feature-card">❤️ <strong>Save Favorites</strong><p>Build your travel wishlist</p></div>
          </div>
        </div>
      );
    }

    // HOME PAGE
    return (
      <div>
        <div className="hero">
          <h1>🌿 Explore Incredible India</h1>
          <p>Find amazing tourist destinations instantly</p>
          <SearchBar onSearch={handleSearch} />
          <Filters onFilter={handleFilter} />
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="empty">
            <span>😕</span>
            <h2>{error}</h2>
            <div className="suggestions" style={{ marginTop: "20px" }}>
              {["Delhi", "Goa", "Jaipur", "Agra", "Varanasi", "Mumbai"].map((city) => (
                <button key={city} className="suggestion-chip" onClick={() => handleSearch(city)}>
                  {city}
                </button>
              ))}
            </div>
          </div>
        ) : places.length > 0 ? (
          <>
            <div className="results-header">
              <h3>
                📍 {filtered.length} place{filtered.length !== 1 ? "s" : ""} found in{" "}
                <span>{searchedLocation}</span>
              </h3>
            </div>
            <PlacesList places={filtered} onSave={handleSave} savedPlaces={savedPlaces} />
          </>
        ) : (
          <div className="welcome-state">
            <div className="welcome-icons">🏔 🏖 🛕 🏛 🌿</div>
            <h2>Start Exploring</h2>
            <p>Search any city above to discover tourist places</p>
            <div className="suggestions">
              {["Delhi", "Goa", "Jaipur", "Agra", "Varanasi", "Mumbai"].map((city) => (
                <button key={city} className="suggestion-chip" onClick={() => handleSearch(city)}>
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Navbar onPageChange={setCurrentPage} currentPage={currentPage} />
      {renderContent()}
    </div>
  );
}

export default Home;