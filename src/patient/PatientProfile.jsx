import React, { useState } from "react";
import "./MobilePatient.css";
import MobileNavigation from "./MobileNavigation";

function PatientProfile({ onBack, onNavigate, onLogout }) {
  const [patientUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("patientUser")) || { name: "Aarav Sharma" };
    } catch {
      return { name: "Aarav Sharma" };
    }
  });

  const [notifications, setNotifications] = useState({
    sms: true,
    whatsapp: true,
    push: true,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="patient-mobile-dashboard" style={{ flex: 1, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>Patient Profile</h2>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>Digital Health Records & Settings</p>
          </div>
          {onBack && (
            <button type="button" className="text-link-btn" onClick={onBack} style={{ fontSize: "12.5px" }}>
              ← Back
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "20px",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #38bdf8)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: "900",
            }}
          >
            {patientUser.name ? patientUser.name.slice(0, 2).toUpperCase() : "AS"}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 2px", fontSize: "17px", color: "#0f172a" }}>{patientUser.name || "Aarav Sharma"}</h3>
            <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>
              {patientUser.phone ? `+91 ${patientUser.phone}` : patientUser.email || "patient@example.com"}
            </span>
            <span
              style={{
                display: "inline-block",
                marginTop: "6px",
                padding: "2px 8px",
                borderRadius: "6px",
                background: "#eff6ff",
                color: "#1d4ed8",
                fontSize: "11px",
                fontWeight: "700",
              }}
            >
              Blood Group: {patientUser.bloodGroup || "O+"}
            </span>
          </div>
        </div>

        {/* Digital Health ID Badge */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "#fff", padding: "16px", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>National Health ID</span>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>● Verified</span>
          </div>
          <div style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "2px", fontFamily: "monospace" }}>
            91-4820-9102-4821
          </div>
        </div>

        {/* Medical History */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            Past Consultations & Visits
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <strong>Dr. Amit Sharma (Cardiology)</strong>
                <span style={{ color: "#10b981", fontWeight: "700" }}>Completed</span>
              </div>
              <small style={{ color: "#64748b" }}>Routine ECG & BP Checkup • 14 days ago</small>
            </div>

            <div style={{ padding: "10px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <strong>Dr. Priya Deshmukh (General)</strong>
                <span style={{ color: "#10b981", fontWeight: "700" }}>Completed</span>
              </div>
              <small style={{ color: "#64748b" }}>Seasonal allergy treatment • 1 month ago</small>
            </div>
          </div>
        </div>

        {/* Notifications Preference */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            Queue Alert Channels
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", cursor: "pointer" }}>
              <span>💬 SMS Notification</span>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "#2563eb" }}
              />
            </label>

            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", cursor: "pointer" }}>
              <span>🟢 WhatsApp Live Queue Updates</span>
              <input
                type="checkbox"
                checked={notifications.whatsapp}
                onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "#2563eb" }}
              />
            </label>

            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", cursor: "pointer" }}>
              <span>🔔 Mobile App Push Alerts</span>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                style={{ width: "18px", height: "18px", accentColor: "#2563eb" }}
              />
            </label>
          </div>
        </div>

        {/* Logout */}
        <div style={{ marginTop: "8px", marginBottom: "20px" }}>
          <button
            type="button"
            className="mobile-primary-btn"
            style={{ background: "#fee2e2", color: "#991b1b", boxShadow: "none" }}
            onClick={onLogout}
          >
            Log Out from Account
          </button>
        </div>
      </div>

      <MobileNavigation
        activeTab="patient-profile"
        onTabChange={onNavigate}
        hasActiveQueue={true}
      />
    </div>
  );
}

export default PatientProfile;
