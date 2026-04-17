// src/components/Loader.js
import React from "react";

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-spinner">
        <span>✈️</span>
      </div>
      <h2 className="loader">Discovering amazing places...</h2>
      <p>Fetching top tourist spots for you</p>
    </div>
  );
}

export default Loader;