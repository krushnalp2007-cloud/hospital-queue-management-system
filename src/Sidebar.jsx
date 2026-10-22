import React from "react";

function Sidebar({ activePage, onNavigate, onOpenPatientMobile }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">+</div>
        <div>
          <h2>MediQueue</h2>
          <span>Hospital Staff Portal</span>
        </div>
      </div>

      {/* Quick Switch to Patient Mobile Portal */}
      <div style={{ padding: "0 12px 14px" }}>
        <button
          type="button"
          onClick={onOpenPatientMobile}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "linear-gradient(135deg, #2563eb, #0284c7)",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontSize: "12.5px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
          }}
        >
          <span>📱</span>
          <span>Open Patient Mobile</span>
        </button>
      </div>

      <nav className="navigation">
        <button
          className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          <span>▦</span>
          Dashboard
        </button>

        <button
          className={`nav-item ${activePage === "queue" ? "active" : ""}`}
          onClick={() => onNavigate("queue")}
        >
          <span>☷</span>
          Queue Management
        </button>

        <button
          className={`nav-item ${activePage === "doctors" ? "active" : ""}`}
          onClick={() => onNavigate("doctors")}
        >
          <span>⚕</span>
          Doctors
        </button>

        <button
          className={`nav-item ${activePage === "appointments" ? "active" : ""}`}
          onClick={() => onNavigate("appointments")}
        >
          <span>◷</span>
          Appointments
        </button>

        <button
          className={`nav-item ${activePage === "emergency" ? "active" : ""}`}
          onClick={() => onNavigate("emergency")}
        >
          <span>🚨</span>
          Emergency
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-dot"></span>
          PostgreSQL Synced
        </div>

        <button className="logout-button" onClick={onOpenPatientMobile}>
          ⇥ Patient App
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
