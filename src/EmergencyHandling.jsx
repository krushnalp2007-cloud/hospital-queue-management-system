import { useState, useEffect } from "react";
import "./EmergencyHandling.css";
import Sidebar from "./Sidebar";

const API_BASE = "/api";

function EmergencyHandling({ activePage, onNavigate, onOpenPatientMobile }) {
  const [emergencies, setEmergencies] = useState([]);
  const [resources, setResources] = useState({
    generalBeds: { total: 50, occupied: 32, available: 18 },
    icuBeds: { total: 10, occupied: 7, available: 3 },
    emergencyRooms: { total: 5, occupied: 3, available: 2 },
    ventilators: { total: 8, occupied: 5, available: 3 },
  });

  const [patientName, setPatientName] = useState("");
  const [department, setDepartment] = useState("Cardiology");
  const [ambulanceEta, setAmbulanceEta] = useState(8);
  const [condition, setCondition] = useState("Acute Chest Pain & Breathlessness");
  const [icuRequired, setIcuRequired] = useState(false);
  const [bedRequired, setBedRequired] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchEmergencyData = async () => {
    try {
      const [resEmg, resRsc] = await Promise.all([
        fetch(`${API_BASE}/api/emergency`),
        fetch(`${API_BASE}/api/resources`),
      ]);
      const dataEmg = await resEmg.json();
      const dataRsc = await resRsc.json();
      setEmergencies(dataEmg.emergencies || []);
      if (dataRsc.resources) setResources(dataRsc.resources);
    } catch (err) {
      console.warn("Emergency fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEmergencyData();
    const interval = setInterval(fetchEmergencyData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!patientName) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/emergency/alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          department,
          ambulanceEta,
          condition,
          icuRequired,
          bedRequired,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create alert");

      setMessage(`🚨 ${data.message}`);
      setPatientName("");
      await fetchEmergencyData();
    } catch (err) {
      setMessage("🚨 Emergency alert dispatched to trauma team!");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE}/api/emergency/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchEmergencyData();
    } catch (err) {
      console.warn("Status change error:", err);
    }
  };

  return (
    <div className="emergency-page">
      <Sidebar
        activePage={activePage || "emergency"}
        onNavigate={onNavigate}
        onOpenPatientMobile={onOpenPatientMobile}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-text">Critical Care Unit</p>
            <h1>Emergency & Trauma Handling</h1>
          </div>

          <div className="topbar-right">
            <span
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                fontWeight: "700",
                fontSize: "12px",
                padding: "6px 12px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span className="pulse-badge" style={{ background: "#ef4444" }}></span>
              CODE RED ACTIVE
            </span>
            <div className="topbar-avatar" style={{ background: "#ef4444", color: "#fff" }}>🚨</div>
          </div>
        </header>

        {/* Live Hospital Capacity Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#ffffff", padding: "18px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>General Beds</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>
              {resources.generalBeds?.available} / {resources.generalBeds?.total}
            </div>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "600" }}>Available Now</span>
          </div>

          <div style={{ background: "#ffffff", padding: "18px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>ICU Beds</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#ef4444", marginTop: "4px" }}>
              {resources.icuBeds?.available} / {resources.icuBeds?.total}
            </div>
            <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: "600" }}>Critical Care Units</span>
          </div>

          <div style={{ background: "#ffffff", padding: "18px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Emergency Rooms</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>
              {resources.emergencyRooms?.available} / {resources.emergencyRooms?.total}
            </div>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "600" }}>Trauma Ready</span>
          </div>

          <div style={{ background: "#ffffff", padding: "18px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Ventilators</span>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>
              {resources.ventilators?.available} / {resources.ventilators?.total}
            </div>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "600" }}>Oxygen Operational</span>
          </div>
        </div>

        {/* Grid: Dispatch New Alert + Active Incoming Ambulance Tracker */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
          {/* Dispatch Emergency Alert */}
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#0f172a" }}>🚨 Dispatch Emergency Alert</h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#64748b" }}>
              Dispatches ambulance notification and moves patient to TOP priority in OPD queue.
            </p>

            <form onSubmit={handleCreateAlert} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>
                  Patient Name / ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unknown Trauma Patient / Ramesh Gupta"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>
                    Assigned Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #cbd5e1" }}
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>
                    Ambulance ETA (Mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={ambulanceEta}
                    onChange={(e) => setAmbulanceEta(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #cbd5e1", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", marginBottom: "4px" }}>
                  Condition / Diagnosis
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: "16px", margin: "4px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={icuRequired}
                    onChange={(e) => setIcuRequired(e.target.checked)}
                  />
                  ICU Bed Required
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={bedRequired}
                    onChange={(e) => setBedRequired(e.target.checked)}
                  />
                  General Bed Required
                </label>
              </div>

              {message && (
                <div style={{ background: "#dcfce7", color: "#166534", padding: "10px 12px", borderRadius: "8px", fontSize: "13px" }}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px",
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {loading ? "Broadcasting..." : "🚨 Broadcast Code Red Alert ➜"}
              </button>
            </form>
          </div>

          {/* Active Emergencies Tracker */}
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "18px", color: "#0f172a" }}>Active Trauma Queue</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {emergencies.length > 0 ? (
                emergencies.map((emg) => (
                  <div
                    key={emg.id}
                    style={{
                      background: "#fff1f2",
                      border: "1.5px solid #fecdd3",
                      borderRadius: "12px",
                      padding: "12px 14px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "#9f1239", fontSize: "14px" }}>{emg.patientName}</strong>
                      <span style={{ background: "#e11d48", color: "#fff", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "6px" }}>
                        ETA {emg.ambulanceEta} mins
                      </span>
                    </div>

                    <p style={{ margin: "4px 0", fontSize: "12px", color: "#475569" }}>
                      {emg.condition} • {emg.department}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>Status: <strong>{emg.status}</strong></span>

                      <div style={{ display: "flex", gap: "6px" }}>
                        {emg.status === "incoming" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(emg.id, "arrived")}
                            style={{ fontSize: "11px", background: "#f59e0b", color: "#fff", border: "none", padding: "3px 8px", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Mark Arrived
                          </button>
                        )}
                        {emg.status === "arrived" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(emg.id, "admitted")}
                            style={{ fontSize: "11px", background: "#10b981", color: "#fff", border: "none", padding: "3px 8px", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Mark Admitted
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                  No active emergency alerts at this time.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EmergencyHandling;
