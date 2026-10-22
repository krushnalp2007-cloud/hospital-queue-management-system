import React, { useState, useEffect } from "react";
import "./MobilePatient.css";
import MobileNavigation from "./MobileNavigation";

const API_BASE = "";

function PatientDashboard({ onNavigate, onLogout }) {
  const [patientUser, setPatientUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("patientUser")) || { name: "Aarav Sharma" };
    } catch {
      return { name: "Aarav Sharma" };
    }
  });

  const [activeQueueItem, setActiveQueueItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch active queue item for this patient
  const fetchPatientQueue = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/queue`);
      if (response.ok) {
        const data = await response.json();
        const queueList = data.queue || [];
        // Find by name or email or take first waiting
        const myItem = queueList.find(
          (q) =>
            q.status !== "completed" &&
            (q.patientName === patientUser.name ||
              q.patient_name === patientUser.name ||
              (patientUser.activeToken && (q.tokenNumber === patientUser.activeToken || q.token_number === patientUser.activeToken)))
        ) || queueList.find((q) => q.status === "waiting") || {
          tokenNumber: patientUser.activeToken || "A-27",
          doctorName: patientUser.doctor || "Dr. Amit Sharma",
          department: patientUser.department || "Cardiology",
          room: "101",
          status: "waiting",
          patientsAhead: 1,
          estimatedWaitTime: 15,
        };

        setActiveQueueItem(myItem);
      }
    } catch (err) {
      console.warn("Queue fetch error:", err);
      // Fallback
      setActiveQueueItem({
        tokenNumber: patientUser.activeToken || "A-27",
        doctorName: patientUser.doctor || "Dr. Amit Sharma",
        department: patientUser.department || "Cardiology",
        room: "101",
        status: "waiting",
        patientsAhead: 1,
        estimatedWaitTime: 15,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientQueue();
    const interval = setInterval(fetchPatientQueue, 3500);
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name) => {
    if (!name) return "PT";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="patient-mobile-dashboard" style={{ flex: 1, overflowY: "auto" }}>
        {/* Top User Greeting */}
        <div className="dashboard-user-greeting">
          <div className="greeting-text">
            <h3>Hello, {patientUser.name || "Patient"} 👋</h3>
            <p>{patientUser.phone ? `+91 ${patientUser.phone}` : patientUser.email || "MediQueue Member"}</p>
          </div>
          <div className="greeting-avatar">
            {getInitials(patientUser.name)}
          </div>
        </div>

        {/* Hero Active Live Token Card */}
        {activeQueueItem && (
          <div className="mobile-token-hero-card">
            <div className="token-card-glow"></div>

            <div className="token-hero-header">
              <span>Current Token</span>
              <span className="token-live-pill">
                <span className="pulse-badge"></span>
                {activeQueueItem.status === "in_consultation" ? "In Consultation" : "Live Queue"}
              </span>
            </div>

            <div className="token-hero-number">
              #{activeQueueItem.tokenNumber || activeQueueItem.token_number || "A-27"}
            </div>

            <div className="token-hero-meta">
              <div className="meta-box">
                <span>Doctor & Room</span>
                <strong>{activeQueueItem.doctorName || activeQueueItem.doctor_name || "Dr. Amit Sharma"} (Rm {activeQueueItem.room || "101"})</strong>
              </div>
              <div className="meta-box">
                <span>Est. Wait Time</span>
                <strong>{activeQueueItem.estimatedWaitTime ?? activeQueueItem.estimated_wait_time ?? 15} Mins</strong>
              </div>
              <div className="meta-box">
                <span>Department</span>
                <strong>{activeQueueItem.department || "Cardiology"}</strong>
              </div>
              <div className="meta-box">
                <span>Patients Ahead</span>
                <strong>{activeQueueItem.patientsAhead ?? activeQueueItem.patients_ahead ?? 1} Ahead</strong>
              </div>
            </div>

            <button
              type="button"
              className="track-queue-btn"
              onClick={() => onNavigate("patient-queue")}
            >
              <span>⏱️ Track Live Queue Details ➜</span>
            </button>
          </div>
        )}

        {/* 2x2 Quick Actions */}
        <div className="mobile-quick-actions-grid">
          <div className="quick-action-card" onClick={() => onNavigate("patient-booking")}>
            <div className="action-card-icon blue">📅</div>
            <strong>Book Doctor</strong>
            <span>Schedule next visit</span>
          </div>

          <div className="quick-action-card" onClick={() => onNavigate("patient-queue")}>
            <div className="action-card-icon green">⏱️</div>
            <strong>Track Queue</strong>
            <span>Real-time position</span>
          </div>

          <div
            className="quick-action-card"
            onClick={() => {
              if (window.confirm("Call Hospital Emergency Ambulance (108)?")) {
                alert("Emergency desk notified! Ambulance dispatched.");
              }
            }}
          >
            <div className="action-card-icon red">🚨</div>
            <strong>Emergency SOS</strong>
            <span>Instant ambulance</span>
          </div>

          <div
            className="quick-action-card"
            onClick={() => alert("Digital prescription records available after consultation.")}
          >
            <div className="action-card-icon orange">📋</div>
            <strong>My Records</strong>
            <span>Prescriptions & lab</span>
          </div>
        </div>

        {/* Emergency SOS Banner */}
        <div className="mobile-sos-banner">
          <div className="sos-content">
            <strong>Need urgent medical care?</strong>
            <span>24/7 Emergency triage team is on standby</span>
          </div>
          <button
            type="button"
            className="sos-call-btn"
            onClick={() => alert("Connecting to SmartCare 24/7 Emergency Line...")}
          >
            Emergency 108
          </button>
        </div>

        {/* Hospital Departments Wait Status */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
              Hospital Department Status
            </span>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>● Updated live</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>❤️ Cardiology (Dr. Amit)</span>
              <strong style={{ color: "#2563eb" }}>~15m wait</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>🩺 General Medicine (Dr. Priya)</span>
              <strong style={{ color: "#2563eb" }}>~20m wait</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>🦴 Orthopedics (Dr. Rajesh)</span>
              <strong style={{ color: "#10b981" }}>~10m wait</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>👶 Pediatrics (Dr. Sneha)</span>
              <strong style={{ color: "#f59e0b" }}>~35m wait (Busy)</strong>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div style={{ textAlign: "center", marginTop: "10px", marginBottom: "20px" }}>
          <button
            type="button"
            className="text-link-btn"
            onClick={onLogout}
            style={{ color: "#ef4444", fontWeight: "700" }}
          >
            Log Out from MediQueue
          </button>
        </div>
      </div>

      {/* Bottom App Navigation */}
      <MobileNavigation
        activeTab="patient-dashboard"
        onTabChange={onNavigate}
        hasActiveQueue={Boolean(activeQueueItem)}
      />
    </div>
  );
}

export default PatientDashboard;
