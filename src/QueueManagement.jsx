import { useEffect, useMemo, useState } from "react";
import "./QueueManagement.css";
import Sidebar from "./Sidebar";

const API_URL = "/api";

function QueueManagement({ onNavigate, onOpenPatientMobile }) {
  const [queue, setQueue] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQueue = async () => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/queue`);
      if (!response.ok) {
        throw new Error("Failed to fetch queue data.");
      }
      const data = await response.json();
      setQueue(data.queue || []);
    } catch (err) {
      console.warn("Queue fetch error:", err);
      // If error, keep existing queue
      if (queue.length === 0) {
        setError("Unable to connect to queue service.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentPatient = useMemo(() => {
    return queue.find(
      (patient) =>
        patient.status === "called" ||
        patient.status === "in_consultation"
    );
  }, [queue]);

  const waitingPatients = useMemo(() => {
    return queue.filter((patient) => patient.status === "waiting");
  }, [queue]);

  const departments = useMemo(() => {
    return [
      ...new Set(
        queue.map((patient) => patient.department).filter(Boolean)
      ),
    ];
  }, [queue]);

  const filteredPatients = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return waitingPatients.filter((patient) => {
      const name = (patient.patient_name || patient.patientName || "").toLowerCase();
      const token = (patient.token_number || patient.tokenNumber || "").toString().toLowerCase();
      const matchesSearch = !searchValue || name.includes(searchValue) || token.includes(searchValue);
      const matchesDepartment = department === "All" || patient.department === department;
      return matchesSearch && matchesDepartment;
    });
  }, [waitingPatients, search, department]);

  const handleNextPatient = async () => {
    try {
      setActionLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/queue/next`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to call next patient.");
      }
      await fetchQueue();
    } catch (err) {
      console.error("Next patient error:", err);
      setError(err.message || "Failed to call next patient.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompletePatient = async () => {
    if (!currentPatient) return;
    try {
      setActionLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/queue/${currentPatient.id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to complete patient.");
      }
      await fetchQueue();
    } catch (err) {
      console.error("Complete patient error:", err);
      setError(err.message || "Failed to complete patient.");
    } finally {
      setActionLoading(false);
    }
  };

  const queueIsActive = queue.length > 0 && (waitingPatients.length > 0 || Boolean(currentPatient));

  return (
    <div className="queue-page">
      <Sidebar
        activePage="queue"
        onNavigate={onNavigate}
        onOpenPatientMobile={onOpenPatientMobile}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-text">Live OPD Counter</p>
            <h1>Queue Management</h1>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="refresh-button"
              onClick={fetchQueue}
              disabled={loading}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🔄 Refresh Queue
            </button>
            <div className="topbar-avatar">🏥</div>
          </div>
        </header>

        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "10px", marginBottom: "16px" }}>
            ⚠️ {error}
          </div>
        )}

        <section className="current-patient-card">
          <div className="current-patient-left">
            <span className="section-label">Currently Serving In OPD</span>

            {currentPatient ? (
              <>
                <div className="token-display">
                  #{currentPatient.token_number || currentPatient.tokenNumber}
                </div>

                <div className="current-patient-info">
                  <h2>{currentPatient.patient_name || currentPatient.patientName}</h2>
                  <p>
                    {currentPatient.department || "General"} • {currentPatient.doctor_name || currentPatient.doctorName} (Room {currentPatient.room || "101"})
                  </p>
                </div>

                <div className="meta-tags">
                  <span className="tag tag-time">
                    ⏱️ Priority: {currentPatient.priority}
                  </span>
                  <span className="tag tag-room">
                    🚪 Room {currentPatient.room || "101"}
                  </span>
                  <span className="tag tag-department">
                    {currentPatient.department || "Cardiology"}
                  </span>
                </div>
              </>
            ) : (
              <div style={{ padding: "20px 0" }}>
                <div className="token-display" style={{ color: "#94a3b8" }}>--</div>
                <h3>No patient currently in consultation</h3>
                <p style={{ color: "#64748b" }}>Click "Call Next Patient" to call from the waiting line.</p>
              </div>
            )}
          </div>

          <div className="current-patient-actions">
            <button
              className="next-button"
              onClick={handleNextPatient}
              disabled={actionLoading || waitingPatients.length === 0}
            >
              {actionLoading ? "Processing..." : "Call Next Patient ➜"}
            </button>

            <button
              className="complete-button"
              onClick={handleCompletePatient}
              disabled={actionLoading || !currentPatient}
            >
              ✓ Mark Completed
            </button>
          </div>
        </section>

        {/* Waiting List Table */}
        <section className="queue-table-card">
          <div className="queue-table-header">
            <div>
              <h3>Waiting Queue ({filteredPatients.length})</h3>
              <p>Ordered by Priority (Emergency → Priority → Normal)</p>
            </div>

            <div className="queue-table-controls">
              <input
                type="text"
                placeholder="Search patient or token..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                }}
              />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <option value="All">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="queue-table">
            <div className="queue-table-heading">
              <span>Token</span>
              <span>Patient Name</span>
              <span>Department</span>
              <span>Doctor</span>
              <span>Room</span>
              <span>Priority</span>
              <span>Action</span>
            </div>

            {loading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                Loading queue data...
              </div>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div className="queue-table-row" key={patient.id}>
                  <span className="queue-token">
                    #{patient.token_number || patient.tokenNumber}
                  </span>

                  <div className="queue-patient-cell">
                    <div className="small-avatar">
                      {getInitials(patient.patient_name || patient.patientName)}
                    </div>
                    <strong>{patient.patient_name || patient.patientName}</strong>
                  </div>

                  <span>{patient.department || "General"}</span>
                  <span>{patient.doctor_name || patient.doctorName || "Doctor"}</span>
                  <span>{patient.room || "101"}</span>

                  <span>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        background:
                          patient.priority === "emergency"
                            ? "#fee2e2"
                            : patient.priority === "priority"
                            ? "#fef3c7"
                            : "#eff6ff",
                        color:
                          patient.priority === "emergency"
                            ? "#991b1b"
                            : patient.priority === "priority"
                            ? "#92400e"
                            : "#1d4ed8",
                      }}
                    >
                      {patient.priority}
                    </span>
                  </span>

                  <button
                    className="call-button"
                    onClick={handleNextPatient}
                    disabled={actionLoading}
                  >
                    Call
                  </button>
                </div>
              ))
            ) : (
              <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                No waiting patients found in this department.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default QueueManagement;
