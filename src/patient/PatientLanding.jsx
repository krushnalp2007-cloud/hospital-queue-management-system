import React from "react";
import "./MobilePatient.css";

function PatientLanding({ onLogin, onRegister, onBookAppointment, onTrackQueue }) {
  return (
    <div className="mobile-login-container" style={{ justifyContent: "center" }}>
      {/* Brand Header */}
      <div className="mobile-login-header" style={{ marginTop: "20px" }}>
        <div className="brand-badge">✚</div>
        <h2>MediQueue Mobile</h2>
        <p>Smart OPD Queue & Patient Care System</p>
      </div>

      {/* Live Queue Hero Preview Card */}
      <div className="mobile-token-hero-card" style={{ marginBottom: "20px" }}>
        <div className="token-card-glow"></div>
        <div className="token-hero-header">
          <span>Live OPD Desk</span>
          <span className="token-live-pill">
            <span className="pulse-badge"></span> Active Now
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
          <div className="token-hero-number" style={{ fontSize: "36px", marginBottom: "0" }}>
            A-27
          </div>
          <span style={{ fontSize: "12px", color: "#bfdbfe" }}>Next in Line</span>
        </div>

        <div style={{ fontSize: "12.5px", color: "#dbeafe", marginBottom: "14px" }}>
          Dr. Amit Sharma • Cardiology (Room 101)
        </div>

        <div className="token-hero-meta" style={{ marginBottom: "0" }}>
          <div className="meta-box">
            <span>Avg Wait Time</span>
            <strong>~15 mins</strong>
          </div>
          <div className="meta-box">
            <span>Doctors On Duty</span>
            <strong>5 Available</strong>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          type="button"
          className="mobile-primary-btn"
          onClick={onLogin}
          style={{ height: "52px" }}
        >
          📱 Patient Mobile Login ➜
        </button>

        <button
          type="button"
          className="biometric-btn"
          onClick={onBookAppointment}
          style={{ height: "48px", borderColor: "#2563eb", color: "#2563eb" }}
        >
          📅 Book New Appointment
        </button>

        <button
          type="button"
          className="biometric-btn"
          onClick={onTrackQueue}
          style={{ height: "46px" }}
        >
          ⏱️ Track Existing Token
        </button>
      </div>

      {/* Features 3-Pill Highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "24px" }}>
        <div style={{ background: "#ffffff", padding: "10px 8px", borderRadius: "12px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "20px" }}>⚡</span>
          <strong style={{ display: "block", fontSize: "11px", color: "#0f172a", marginTop: "4px" }}>Zero Wait</strong>
        </div>
        <div style={{ background: "#ffffff", padding: "10px 8px", borderRadius: "12px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "20px" }}>🔔</span>
          <strong style={{ display: "block", fontSize: "11px", color: "#0f172a", marginTop: "4px" }}>Live Alerts</strong>
        </div>
        <div style={{ background: "#ffffff", padding: "10px 8px", borderRadius: "12px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "20px" }}>🚑</span>
          <strong style={{ display: "block", fontSize: "11px", color: "#0f172a", marginTop: "4px" }}>24/7 SOS</strong>
        </div>
      </div>

      {/* Footer */}
      <div className="mobile-login-footer" style={{ marginTop: "24px", marginBottom: "10px" }}>
        <div>
          <span>First time visitor? </span>
          <button type="button" className="text-link-btn" onClick={onRegister}>
            Register as Patient
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientLanding;
