import React, { useState, useEffect } from "react";
import "./MobilePatient.css";

function MobileFrame({ children, onSwitchToStaff, isFullWidth = false, onToggleFullWidth }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mobile-view-wrapper">
      {/* Desktop Helper Toolbar */}
      <div className="mobile-top-toolbar">
        <div className="mobile-toolbar-left">
          <span className="pulse-badge"></span>
          <span><strong>Patient Mobile Portal</strong></span>
        </div>
        <div className="mobile-toolbar-right">
          <button
            type="button"
            className="toolbar-btn"
            onClick={onToggleFullWidth}
            title="Toggle between phone mockup and expanded full view"
          >
            {isFullWidth ? "📱 Phone Frame" : "↔️ Expand"}
          </button>
          <button
            type="button"
            className="toolbar-btn staff-portal-btn"
            onClick={onSwitchToStaff}
            title="Switch to Hospital Admin & Doctor Dashboard"
          >
            🏥 Staff Desk
          </button>
        </div>
      </div>

      {/* Smartphone Hardware Frame */}
      <div className={`smartphone-chassis ${isFullWidth ? "full-view-mode" : ""}`}>
        {/* iOS-style Status Bar with Dynamic Island / Notch */}
        <div className="mobile-status-bar">
          <span className="status-bar-time">{currentTime || "9:41"}</span>

          <div className="status-bar-notch">
            <div className="status-bar-notch-camera"></div>
          </div>

          <div className="status-bar-icons">
            <span>5G</span>
            <span>📶</span>
            <span>🔋 100%</span>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="mobile-screen-content">
          {children}
        </div>

        {/* Home gesture bar */}
        <div className="mobile-home-indicator">
          <div className="home-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default MobileFrame;
