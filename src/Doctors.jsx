import { useState, useEffect } from "react";
import "./Doctors.css";
import Sidebar from "./Sidebar";

const API_BASE = "/api";

function Doctors({ activePage, onNavigate, onOpenPatientMobile }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/doctors`);
      const data = await response.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.warn("Doctors fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleStatusChange = async (docId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/doctors/${docId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, status: newStatus } : d))
        );
        if (selectedDoctor && selectedDoctor.id === docId) {
          setSelectedDoctor((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      (doctor.specialization || "").toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      department === "All" || doctor.department === department;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="doctors-page">
      <Sidebar
        activePage={activePage || "doctors"}
        onNavigate={onNavigate}
        onOpenPatientMobile={onOpenPatientMobile}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-text">Staff & Duty Roster</p>
            <h1>Doctor Management</h1>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="refresh-button"
              onClick={fetchDoctors}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🔄 Refresh Doctors
            </button>
            <div className="topbar-avatar">⚕️</div>
          </div>
        </header>

        {/* Filter Controls */}
        <div className="doctor-controls">
          <input
            type="text"
            placeholder="Search by doctor or specialization..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="department-filter">
            {["All", "Cardiology", "General Medicine", "Orthopedics", "Pediatrics", "Neurology"].map((dept) => (
              <button
                key={dept}
                className={`filter-tab ${department === dept ? "active" : ""}`}
                onClick={() => setDepartment(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="doctors-grid">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className={`doctor-card ${selectedDoctor?.id === doc.id ? "selected" : ""}`}
              onClick={() => setSelectedDoctor(doc)}
            >
              <div className="doctor-card-top">
                <div className="doctor-avatar">
                  {doc.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3>{doc.name}</h3>
                  <p className="specialization">{doc.specialization || doc.department}</p>
                </div>
              </div>

              <div className="doctor-meta">
                <div>
                  <span>Department</span>
                  <strong>{doc.department}</strong>
                </div>
                <div>
                  <span>OPD Room</span>
                  <strong>Room {doc.room}</strong>
                </div>
                <div>
                  <span>Experience</span>
                  <strong>{doc.experience_years || 8} Years</strong>
                </div>
              </div>

              <div className="doctor-status-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: doc.status === "Available" ? "#dcfce7" : doc.status === "Busy" ? "#fee2e2" : "#fef3c7",
                    color: doc.status === "Available" ? "#166534" : doc.status === "Busy" ? "#991b1b" : "#b45309",
                  }}
                >
                  ● {doc.status}
                </span>

                <select
                  value={doc.status}
                  onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Break">On Break</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Doctors;
