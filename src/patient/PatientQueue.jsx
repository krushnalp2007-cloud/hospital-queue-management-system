import React, { useState, useEffect } from "react";
import "./MobilePatient.css";
import MobileNavigation from "./MobileNavigation";

const API_BASE = "";

function PatientQueue({ onBack, onNavigate }) {
  const [patientUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("patientUser")) || { name: "Aarav Sharma" };
    } catch {
      return { name: "Aarav Sharma" };
    }
  });

  const [queueList, setQueueList] = useState([]);
  const [myQueueItem, setMyQueueItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const fetchQueueData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/queue`);
      if (response.ok) {
        const data = await response.json();
        const list = data.queue || [];
        setQueueList(list);

        // Find current patient's entry
        const found =
          list.find(
            (q) =>
              (q.patientName === patientUser.name || q.patient_name === patientUser.name) &&
              q.status !== "completed"
          ) ||
          list.find(
            (q) =>
              patientUser.activeToken &&
              (q.tokenNumber === patientUser.activeToken || q.token_number === patientUser.activeToken)
          ) ||
          list.find((q) => q.status === "in_consultation") ||
          list[0] ||
          null;

        setMyQueueItem(found);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn("Queue fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAlerts = () => {
    if (!alertsEnabled && "Notification" in window) {
      Notification.requestPermission();
    }
    setAlertsEnabled(!alertsEnabled);
  };

  // Calculate progress percent
  const patientsAhead = myQueueItem?.patientsAhead ?? myQueueItem?.patients_ahead ?? 1;
  const isCalled = myQueueItem?.status === "in_consultation" || myQueueItem?.status === "called";
  const progressPercent = isCalled ? 100 : Math.max(15, 100 - patientsAhead * 20);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="patient-mobile-dashboard" style={{ flex: 1, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>Live Queue Status</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <span className="pulse-badge"></span>
              <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>Live Synchronized • {lastUpdated}</span>
            </div>
          </div>
          {onBack && (
            <button
              type="button"
              className="text-link-btn"
              onClick={onBack}
              style={{ fontSize: "12.5px" }}
            >
              ← Back
            </button>
          )}
        </div>

        {/* Turn Called Celebration Banner */}
        {isCalled && (
          <div
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#ffffff",
              padding: "16px",
              borderRadius: "18px",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              animation: "pulseBeacon 2s infinite",
            }}
          >
            <span style={{ fontSize: "32px" }}>📢</span>
            <div>
              <strong style={{ fontSize: "15px", display: "block" }}>IT'S YOUR TURN NOW!</strong>
              <span style={{ fontSize: "12.5px" }}>Please proceed directly to Room {myQueueItem?.room || "101"}</span>
            </div>
          </div>
        )}

        {/* Big Live Token Hero Card */}
        {myQueueItem && (
          <div className="mobile-token-hero-card">
            <div className="token-card-glow"></div>

            <div className="token-hero-header">
              <span>Token Allocated</span>
              <span className="token-live-pill">
                <span className="pulse-badge"></span>
                {myQueueItem.status === "in_consultation"
                  ? "👉 IN CONSULTATION NOW"
                  : myQueueItem.status === "called"
                  ? "📢 TOKEN CALLED - ENTER ROOM"
                  : "WAITING IN OPD"}
              </span>
            </div>

            <div className="token-hero-number">
              #{myQueueItem.tokenNumber || myQueueItem.token_number || "CARD-102"}
            </div>

            <div style={{ marginBottom: "14px", fontSize: "13px", color: "#dbeafe" }}>
              <strong>{myQueueItem.doctorName || myQueueItem.doctor_name || "Dr. Amit Sharma"}</strong> • Room {myQueueItem.room || "101"} ({myQueueItem.department || "Cardiology"})
            </div>

            {/* Visual Progress Bar */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", marginBottom: "6px", color: "#bfdbfe" }}>
                <span>Queue Position</span>
                <span>{isCalled ? "Inside Doctor Room!" : patientsAhead === 0 ? "You're next!" : `${patientsAhead} patients ahead`}</span>
              </div>
              <div style={{ height: "8px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "6px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background: isCalled ? "#10b981" : "#38bdf8",
                    borderRadius: "6px",
                    transition: "width 0.5s ease",
                  }}
                ></div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="token-hero-meta" style={{ marginBottom: "14px" }}>
              <div className="meta-box">
                <span>Estimated Wait</span>
                <strong>{isCalled ? "0 min" : `~${myQueueItem.estimatedWaitTime ?? myQueueItem.estimated_wait_time ?? 15} Mins`}</strong>
              </div>
              <div className="meta-box">
                <span>Priority Level</span>
                <strong style={{ textTransform: "capitalize" }}>{myQueueItem.priority || "Normal"}</strong>
              </div>
            </div>

            {/* Digital Pass Button */}
            <button
              type="button"
              className="track-queue-btn"
              onClick={() => onNavigate("patient-ticket")}
            >
              <span>🎟️ View Digital QR Ticket Pass ➜</span>
            </button>
          </div>
        )}

        {/* Notification Alert Toggle */}
        <div
          onClick={handleToggleAlerts}
          style={{
            background: "#ffffff",
            padding: "12px 14px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🔔</span>
            <div>
              <strong style={{ fontSize: "13px", color: "#0f172a", display: "block" }}>Turn Approaching Alert</strong>
              <small style={{ fontSize: "11px", color: "#64748b" }}>We'll buzz your phone 10 mins before</small>
            </div>
          </div>
          <input
            type="checkbox"
            checked={alertsEnabled}
            onChange={() => {}}
            style={{ width: "18px", height: "18px", accentColor: "#2563eb", cursor: "pointer" }}
          />
        </div>

        {/* Full Department Queue Board */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
              Hospital Queue Roster
            </span>
            <button
              type="button"
              className="text-link-btn"
              onClick={fetchQueueData}
              style={{ fontSize: "12px" }}
            >
              🔄 Refresh
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {queueList.length > 0 ? (
              queueList.map((item, index) => {
                const isMe =
                  item.tokenNumber === myQueueItem?.tokenNumber ||
                  item.token_number === myQueueItem?.token_number ||
                  item.patientName === patientUser.name;

                return (
                  <div
                    key={item.id || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      background: isMe ? "#eff6ff" : "#f8fafc",
                      border: isMe ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                      fontSize: "12.5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong style={{ color: "#2563eb" }}>#{item.tokenNumber || item.token_number}</strong>
                      <span style={{ color: "#334155", fontWeight: isMe ? "700" : "500" }}>
                        {item.patientName || item.patient_name || "Patient"} {isMe ? "(You)" : ""}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background:
                            item.status === "in_consultation"
                              ? "#dbeafe"
                              : item.status === "waiting"
                              ? "#f1f5f9"
                              : "#dcfce7",
                          color:
                            item.status === "in_consultation"
                              ? "#1d4ed8"
                              : item.status === "waiting"
                              ? "#475569"
                              : "#166534",
                        }}
                      >
                        {item.status === "in_consultation" ? "In Room" : item.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", textAlign: "center" }}>
                No active patients in queue.
              </p>
            )}
          </div>
        </div>

        {/* Doctor Consultation Room Guidance */}
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 14px", borderRadius: "14px", fontSize: "12.5px", color: "#166534" }}>
          <strong>📍 Hospital Lobby Instructions:</strong>
          <p style={{ margin: "4px 0 0", color: "#15803d", lineHeight: "1.4" }}>
            When your token turns green, proceed directly to Consultation Room {myQueueItem?.room || "101"}. Keep your token card open.
          </p>
        </div>
      </div>

      <MobileNavigation
        activeTab="patient-queue"
        onTabChange={onNavigate}
        hasActiveQueue={true}
      />
    </div>
  );
}

export default PatientQueue;
