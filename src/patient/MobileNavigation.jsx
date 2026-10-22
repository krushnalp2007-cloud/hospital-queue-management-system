import React from "react";
import "./MobilePatient.css";

function MobileNavigation({ activeTab, onTabChange, hasActiveQueue = true }) {
  return (
    <nav className="mobile-nav-bar">
      <button
        type="button"
        className={`mobile-nav-item ${activeTab === "patient-dashboard" ? "active" : ""}`}
        onClick={() => onTabChange("patient-dashboard")}
      >
        <span className="nav-icon">🏠</span>
        <span>Home</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${activeTab === "patient-queue" ? "active" : ""}`}
        onClick={() => onTabChange("patient-queue")}
      >
        <span className="nav-icon">⏱️</span>
        {hasActiveQueue && <span className="nav-live-dot"></span>}
        <span>Queue</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${activeTab === "patient-booking" ? "active" : ""}`}
        onClick={() => onTabChange("patient-booking")}
      >
        <span className="nav-icon">📅</span>
        <span>Book</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${activeTab === "patient-ticket" ? "active" : ""}`}
        onClick={() => onTabChange("patient-ticket")}
      >
        <span className="nav-icon">🎟️</span>
        <span>Pass</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${activeTab === "patient-profile" ? "active" : ""}`}
        onClick={() => onTabChange("patient-profile")}
      >
        <span className="nav-icon">👤</span>
        <span>Profile</span>
      </button>
    </nav>
  );
}

export default MobileNavigation;
