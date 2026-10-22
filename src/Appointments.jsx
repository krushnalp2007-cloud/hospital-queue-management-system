import { useState, useEffect } from "react";
import "./Appointments.css";
import Sidebar from "./Sidebar";

const API_BASE = "/api";

function Appointments({ activePage, onNavigate, onOpenPatientMobile }) {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/appointments`);
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.warn("Appointments fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filtered = appointments.filter((apt) => {
    const pName = (apt.patient_name || "").toLowerCase();
    const docName = (apt.doctor_name || "").toLowerCase();
    const token = (apt.token_number || "").toLowerCase();
    const s = search.toLowerCase();
    const matchesSearch = !s || pName.includes(s) || docName.includes(s) || token.includes(s);
    const matchesStatus = statusFilter === "all" || apt.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="appointments-page">
      <Sidebar
        activePage={activePage || "appointments"}
        onNavigate={onNavigate}
        onOpenPatientMobile={onOpenPatientMobile}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-text">Consultation Schedule</p>
            <h1>Appointments</h1>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="refresh-button"
              onClick={fetchAppointments}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🔄 Refresh List
            </button>
            <div className="topbar-avatar">◷</div>
          </div>
        </header>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search patient, doctor, or token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="waiting">Waiting</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Appointments Table */}
        <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1.2fr 1fr 1fr 100px 100px 110px", padding: "14px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontWeight: "700", fontSize: "13px", color: "#64748b" }}>
            <span>Token</span>
            <span>Patient</span>
            <span>Doctor</span>
            <span>Department</span>
            <span>Date</span>
            <span>Priority</span>
            <span>Status</span>
          </div>

          <div>
            {loading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Loading appointments...</div>
            ) : filtered.length > 0 ? (
              filtered.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1.2fr 1fr 1fr 100px 100px 110px",
                    padding: "14px 20px",
                    borderBottom: "1px solid #f1f5f9",
                    alignItems: "center",
                    fontSize: "13.5px",
                  }}
                >
                  <strong style={{ color: "#2563eb" }}>#{apt.token_number || "--"}</strong>
                  <div>
                    <strong style={{ display: "block", color: "#0f172a" }}>{apt.patient_name || "Patient"}</strong>
                    <small style={{ color: "#64748b" }}>{apt.patient_phone || apt.patient_email || ""}</small>
                  </div>
                  <span>{apt.doctor_name || "Doctor"} (Rm {apt.doctor_room || "101"})</span>
                  <span>{apt.department || "Cardiology"}</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{apt.appointment_date || "Today"}</span>
                  <span>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        background: apt.priority === "emergency" ? "#fee2e2" : apt.priority === "priority" ? "#fef3c7" : "#eff6ff",
                        color: apt.priority === "emergency" ? "#991b1b" : apt.priority === "priority" ? "#92400e" : "#1d4ed8",
                      }}
                    >
                      {apt.priority || "normal"}
                    </span>
                  </span>
                  <span>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "11.5px",
                        fontWeight: "700",
                        background: apt.status === "completed" ? "#dcfce7" : apt.status === "confirmed" ? "#dbeafe" : "#f1f5f9",
                        color: apt.status === "completed" ? "#166534" : apt.status === "confirmed" ? "#1d4ed8" : "#475569",
                      }}
                    >
                      {apt.status || "waiting"}
                    </span>
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>No appointments found matching filter.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Appointments;
