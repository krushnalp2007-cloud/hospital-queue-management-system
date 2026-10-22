import React, { useState, useEffect } from "react";
import "./App.css";

// Patient Mobile Components
import MobileFrame from "./patient/MobileFrame";
import PatientLanding from "./patient/PatientLanding";
import PatientLogin from "./patient/PatientLogin";
import PatientRegister from "./patient/PatientRegister";
import PatientDashboard from "./patient/PatientDashboard";
import PatientBooking from "./patient/PatientBooking";
import PatientQueue from "./patient/PatientQueue";
import PatientTicket from "./patient/PatientTicket";
import PatientProfile from "./patient/PatientProfile";

// Hospital Staff Components
import Sidebar from "./Sidebar";
import QueueManagement from "./QueueManagement";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import EmergencyHandling from "./EmergencyHandling";

const API_BASE = "/api";

function App() {
  // Portal mode: 'patient' or 'staff'
  const [portalMode, setPortalMode] = useState("patient");
  const [mobileFullWidth, setMobileFullWidth] = useState(false);

  // Active page within patient portal
  // Options: 'patient-login', 'patient-landing', 'patient-register', 'patient-dashboard', 'patient-booking', 'patient-queue', 'patient-ticket', 'patient-profile'
  const [patientPage, setPatientPage] = useState("patient-login");

  // Active page within staff portal
  // Options: 'dashboard', 'queue', 'doctors', 'appointments', 'emergency'
  const [staffPage, setStaffPage] = useState("dashboard");

  // Hospital Dashboard Metrics
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalPatients: 4,
    waitingPatients: 3,
    emergencyPatients: 1,
    completedPatients: 1,
    averageWaitingTime: 15,
  });

  const [departmentCounts, setDepartmentCounts] = useState({
    Cardiology: 2,
    "General Medicine": 1,
    Orthopedics: 1,
  });

  // Fetch summary metrics from backend
  const fetchDashboardMetrics = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/queue/dashboard/summary`);
      if (response.ok) {
        const data = await response.json();
        setDashboardMetrics({
          totalPatients: data.totalPatients ?? 4,
          waitingPatients: data.waitingPatients ?? 3,
          emergencyPatients: data.emergencyPatients ?? 1,
          completedPatients: data.completedPatients ?? 1,
          averageWaitingTime: data.averageWaitingTime ?? 15,
        });
      }

      const qRes = await fetch(`${API_BASE}/api/queue`);
      if (qRes.ok) {
        const qData = await qRes.json();
        const depts = {};
        (qData.queue || []).forEach((q) => {
          if (q.status === "waiting") {
            const d = q.department || "General";
            depts[d] = (depts[d] || 0) + 1;
          }
        });
        if (Object.keys(depts).length > 0) setDepartmentCounts(depts);
      }
    } catch (err) {
      console.warn("Metrics fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
    const interval = setInterval(fetchDashboardMetrics, 3500);
    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // RENDER PATIENT MOBILE APPLICATION
  // =========================================================
  if (portalMode === "patient") {
    let patientContent = null;

    switch (patientPage) {
      case "patient-login":
        patientContent = (
          <PatientLogin
            onBack={() => setPatientPage("patient-landing")}
            onRegister={() => setPatientPage("patient-register")}
            onLoginSuccess={() => setPatientPage("patient-dashboard")}
            onTrackQueue={() => setPatientPage("patient-queue")}
          />
        );
        break;

      case "patient-register":
        patientContent = (
          <PatientRegister
            onBack={() => setPatientPage("patient-login")}
            onLogin={() => setPatientPage("patient-login")}
            onRegisterSuccess={() => setPatientPage("patient-dashboard")}
          />
        );
        break;

      case "patient-landing":
        patientContent = (
          <PatientLanding
            onLogin={() => setPatientPage("patient-login")}
            onRegister={() => setPatientPage("patient-register")}
            onBookAppointment={() => setPatientPage("patient-booking")}
            onTrackQueue={() => setPatientPage("patient-queue")}
          />
        );
        break;

      case "patient-dashboard":
        patientContent = (
          <PatientDashboard
            onNavigate={(page) => setPatientPage(page)}
            onLogout={() => {
              localStorage.removeItem("patientToken");
              localStorage.removeItem("patientUser");
              setPatientPage("patient-login");
            }}
          />
        );
        break;

      case "patient-booking":
        patientContent = (
          <PatientBooking
            onBack={() => setPatientPage("patient-dashboard")}
            onNavigate={(page) => setPatientPage(page)}
          />
        );
        break;

      case "patient-queue":
        patientContent = (
          <PatientQueue
            onBack={() => setPatientPage("patient-dashboard")}
            onNavigate={(page) => setPatientPage(page)}
          />
        );
        break;

      case "patient-ticket":
        patientContent = (
          <PatientTicket
            onBack={() => setPatientPage("patient-dashboard")}
            onNavigate={(page) => setPatientPage(page)}
          />
        );
        break;

      case "patient-profile":
        patientContent = (
          <PatientProfile
            onBack={() => setPatientPage("patient-dashboard")}
            onNavigate={(page) => setPatientPage(page)}
            onLogout={() => {
              localStorage.removeItem("patientToken");
              localStorage.removeItem("patientUser");
              setPatientPage("patient-login");
            }}
          />
        );
        break;

      default:
        patientContent = (
          <PatientLogin
            onBack={() => setPatientPage("patient-landing")}
            onRegister={() => setPatientPage("patient-register")}
            onLoginSuccess={() => setPatientPage("patient-dashboard")}
            onTrackQueue={() => setPatientPage("patient-queue")}
          />
        );
    }

    return (
      <MobileFrame
        isFullWidth={mobileFullWidth}
        onToggleFullWidth={() => setMobileFullWidth(!mobileFullWidth)}
        onSwitchToStaff={() => setPortalMode("staff")}
      >
        {patientContent}
      </MobileFrame>
    );
  }

  // =========================================================
  // RENDER HOSPITAL STAFF & DOCTOR OPERATIONS DESK (REACT)
  // =========================================================
  return (
    <div className="app">
      <Sidebar
        activePage={staffPage}
        onNavigate={setStaffPage}
        onOpenPatientMobile={() => {
          setPortalMode("patient");
          setPatientPage("patient-login");
        }}
      />

      <main className="main-content">
        {/* Top persistent quick switch pill */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 18px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#1e40af" }}>
            <span>🏥</span>
            <span>You are currently in <strong>Hospital Staff Operations Portal</strong>.</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setPortalMode("patient");
              setPatientPage("patient-login");
            }}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              padding: "7px 16px",
              borderRadius: "8px",
              fontSize: "12.5px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
            }}
          >
            📱 Switch to Patient Mobile App ➜
          </button>
        </div>

        {/* STAFF SUB-PAGES */}
        {staffPage === "dashboard" && (
          <div>
            <header className="topbar">
              <div>
                <p className="welcome-text">Hospital Control Center</p>
                <h1>SmartCare Operations Dashboard</h1>
              </div>

              <div className="topbar-right">
                <button
                  type="button"
                  className="refresh-button"
                  onClick={fetchDashboardMetrics}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  🔄 Live Sync
                </button>
                <div className="topbar-avatar">🏥</div>
              </div>
            </header>

            {/* Dashboard 4 Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              <div className="dashboard-card">
                <span className="card-label">Total Patients Registered</span>
                <h2>{dashboardMetrics.totalPatients}</h2>
                <span className="card-subtext">Across all hospital departments</span>
              </div>

              <div className="dashboard-card">
                <span className="card-label">Waiting in Queue</span>
                <h2 style={{ color: "#2563eb" }}>{dashboardMetrics.waitingPatients}</h2>
                <span className="card-subtext">Currently seated in OPD lobbies</span>
              </div>

              <div className="dashboard-card">
                <span className="card-label">Emergency Trauma Cases</span>
                <h2 style={{ color: "#ef4444" }}>{dashboardMetrics.emergencyPatients}</h2>
                <span className="card-subtext">Critical priority dispatch</span>
              </div>

              <div className="dashboard-card">
                <span className="card-label">Average Wait Time</span>
                <h2 style={{ color: "#10b981" }}>~{dashboardMetrics.averageWaitingTime} min</h2>
                <span className="card-subtext">Real-time consultation rate</span>
              </div>
            </div>

            {/* Department Breakdown & Quick Nav Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px", marginTop: "28px" }}>
              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px", color: "#0f172a" }}>Department Waiting Queues</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {Object.entries(departmentCounts).map(([dept, count]) => (
                    <div
                      key={dept}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        background: "#f8fafc",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <strong style={{ color: "#1e293b" }}>{dept}</strong>
                      <span
                        style={{
                          background: "#dbeafe",
                          color: "#1e40af",
                          fontWeight: "800",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "13px",
                        }}
                      >
                        {count} waiting
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px", color: "#0f172a" }}>Quick Actions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setStaffPage("queue")}
                    style={{
                      padding: "12px 16px",
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    ☷ Manage Live OPD Queue ➜
                  </button>

                  <button
                    type="button"
                    onClick={() => setStaffPage("doctors")}
                    style={{
                      padding: "12px 16px",
                      background: "#f1f5f9",
                      color: "#1e293b",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    ⚕️ Doctor Duty & Room Status ➜
                  </button>

                  <button
                    type="button"
                    onClick={() => setStaffPage("emergency")}
                    style={{
                      padding: "12px 16px",
                      background: "#fee2e2",
                      color: "#991b1b",
                      border: "1px solid #fecaca",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    🚨 Emergency & Trauma Alerts ➜
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {staffPage === "queue" && (
          <QueueManagement
            onNavigate={setStaffPage}
            onOpenPatientMobile={() => {
              setPortalMode("patient");
              setPatientPage("patient-login");
            }}
          />
        )}

        {staffPage === "doctors" && (
          <Doctors
            activePage={staffPage}
            onNavigate={setStaffPage}
            onOpenPatientMobile={() => {
              setPortalMode("patient");
              setPatientPage("patient-login");
            }}
          />
        )}

        {staffPage === "appointments" && (
          <Appointments
            activePage={staffPage}
            onNavigate={setStaffPage}
            onOpenPatientMobile={() => {
              setPortalMode("patient");
              setPatientPage("patient-login");
            }}
          />
        )}

        {staffPage === "emergency" && (
          <EmergencyHandling
            activePage={staffPage}
            onNavigate={setStaffPage}
            onOpenPatientMobile={() => {
              setPortalMode("patient");
              setPatientPage("patient-login");
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
