import React, { useState, useEffect } from "react";
import "./MobilePatient.css";
import MobileNavigation from "./MobileNavigation";

const API_BASE = "";

function PatientTicket({ onBack, onNavigate }) {
  const [patientUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("patientUser")) || { name: "Aarav Sharma" };
    } catch {
      return { name: "Aarav Sharma" };
    }
  });

  const [ticketData, setTicketData] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Fetch active queue item for ticket
    fetch(`${API_BASE}/api/queue`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.queue || [];
        const myItem =
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
          list[0];

        if (myItem) {
          setTicketData({
            tokenNumber: myItem.tokenNumber || myItem.token_number || "CARD-102",
            doctorName: myItem.doctorName || myItem.doctor_name || "Dr. Amit Sharma",
            department: myItem.department || "Cardiology",
            room: myItem.room || "101",
            status: myItem.status || "waiting",
            date: myItem.appointment_date || new Date().toISOString().split("T")[0],
            time: myItem.appointment_time || "10:00 AM",
            priority: myItem.priority || "Normal",
          });
        }
      })
      .catch(() => {
        setTicketData({
          tokenNumber: patientUser.activeToken || "CARD-102",
          doctorName: patientUser.doctor || "Dr. Amit Sharma",
          department: patientUser.department || "Cardiology",
          room: "101",
          status: "waiting",
          date: new Date().toISOString().split("T")[0],
          time: "10:00 AM",
          priority: "Normal",
        });
      });
  }, [patientUser]);

  const handleDownload = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="patient-mobile-dashboard" style={{ flex: 1, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>Digital Health Pass</h2>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>Scan at hospital check-in kiosks</p>
          </div>
          {onBack && (
            <button type="button" className="text-link-btn" onClick={onBack} style={{ fontSize: "12.5px" }}>
              ← Back
            </button>
          )}
        </div>

        {ticketData ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Top Pass Brand Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                padding: "20px",
                color: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: "#93c5fd" }}>
                  MediQueue Smart OPD Pass
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: "18px", color: "#ffffff" }}>
                  SmartCare Super-Specialty
                </h3>
              </div>
              <div style={{ width: "38px", height: "38px", background: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                ✚
              </div>
            </div>

            {/* Token Highlight Banner */}
            <div style={{ padding: "20px", textAlign: "center", background: "#f8fafc", borderBottom: "2px dashed #cbd5e1" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                OPD Token Number
              </span>
              <div style={{ fontSize: "44px", fontWeight: "900", color: "#2563eb", letterSpacing: "-1px", margin: "4px 0" }}>
                #{ticketData.tokenNumber}
              </div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: "800",
                  background: ticketData.status === "in_consultation" ? "#dcfce7" : "#eff6ff",
                  color: ticketData.status === "in_consultation" ? "#166534" : "#1d4ed8",
                }}
              >
                ● {ticketData.status === "in_consultation" ? "Inside Consultation" : "Waiting in OPD"}
              </span>
            </div>

            {/* Ticket Details Grid */}
            <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "13px" }}>
              <div>
                <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Patient Name</span>
                <strong style={{ color: "#0f172a" }}>{patientUser.name || "Aarav Sharma"}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Doctor In Charge</span>
                <strong style={{ color: "#0f172a" }}>{ticketData.doctorName}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Department</span>
                <strong style={{ color: "#0f172a" }}>{ticketData.department}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>OPD Room</span>
                <strong style={{ color: "#2563eb" }}>Room {ticketData.room}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Date & Slot</span>
                <strong style={{ color: "#0f172a" }}>{ticketData.date} • {ticketData.time}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Priority Level</span>
                <strong style={{ color: "#0f172a", textTransform: "capitalize" }}>{ticketData.priority}</strong>
              </div>
            </div>

            {/* Interactive QR Code Section */}
            <div style={{ padding: "16px 20px 24px", textAlign: "center", borderTop: "1px solid #f1f5f9" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "12px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <svg width="130" height="130" viewBox="0 0 100 100">
                  {/* Styled QR Code SVG */}
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="4" />
                  <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="18" y="18" width="8" height="8" fill="#0f172a" rx="1" />

                  <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="4" />
                  <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="74" y="18" width="8" height="8" fill="#0f172a" rx="1" />

                  <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="4" />
                  <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="18" y="74" width="8" height="8" fill="#0f172a" rx="1" />

                  {/* QR Matrix Dots */}
                  <rect x="42" y="14" width="6" height="10" fill="#2563eb" rx="2" />
                  <rect x="52" y="18" width="8" height="6" fill="#0f172a" rx="2" />
                  <rect x="40" y="40" width="20" height="20" fill="#2563eb" rx="4" />
                  <rect x="45" y="45" width="10" height="10" fill="#ffffff" rx="2" />
                  <rect x="48" y="48" width="4" height="4" fill="#2563eb" />

                  <rect x="16" y="42" width="8" height="8" fill="#0f172a" rx="2" />
                  <rect x="28" y="46" width="6" height="12" fill="#0f172a" rx="2" />
                  <rect x="68" y="42" width="12" height="6" fill="#0f172a" rx="2" />
                  <rect x="76" y="52" width="10" height="10" fill="#0f172a" rx="2" />
                  <rect x="42" y="70" width="12" height="6" fill="#2563eb" rx="2" />
                  <rect x="60" y="74" width="8" height="12" fill="#0f172a" rx="2" />
                  <rect x="74" y="76" width="12" height="12" fill="#0f172a" rx="2" />
                </svg>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: "11px", color: "#64748b" }}>
                Point QR code at entrance scanners to fast-track check-in
              </p>
            </div>
          </div>
        ) : (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
            No active appointment pass found. Book an appointment first.
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button
            type="button"
            className="mobile-primary-btn"
            style={{ flex: 1, height: "46px" }}
            onClick={handleDownload}
          >
            {savedSuccess ? "✓ Saved to Passbook!" : "📲 Add to Mobile Passbook"}
          </button>
          <button
            type="button"
            className="biometric-btn"
            style={{ width: "50px", height: "46px", flexShrink: 0 }}
            onClick={() => window.print && window.print()}
            title="Share or print pass"
          >
            📤
          </button>
        </div>
      </div>

      <MobileNavigation
        activeTab="patient-ticket"
        onTabChange={onNavigate}
        hasActiveQueue={true}
      />
    </div>
  );
}

export default PatientTicket;
