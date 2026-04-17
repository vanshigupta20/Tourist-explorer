// src/components/Navbar.js
import React, { useState } from "react";

function Navbar({ onPageChange, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✈️</span>
        <h2>Tourist Explorer</h2>
      </div>
      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <button
          className={currentPage === "home" ? "active" : ""}
          onClick={() => { onPageChange("home"); setMenuOpen(false); }}
        >
          🏠 Home
        </button>
        <button
          className={currentPage === "favorites" ? "active" : ""}
          onClick={() => { onPageChange("favorites"); setMenuOpen(false); }}
        >
          ❤️ Favorites
        </button>
        <button
          className={currentPage === "about" ? "active" : ""}
          onClick={() => { onPageChange("about"); setMenuOpen(false); }}
        >
          ℹ️ About
        </button>
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </nav>
  );
}

export default Navbar;