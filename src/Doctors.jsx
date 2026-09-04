import { useState } from "react";
import "./Doctors.css";
import Sidebar from "./Sidebar";

function Doctors({
  activePage,
  onNavigate,
}) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 1,
      name: "Dr. Amit Sharma",
      initials: "AS",
      department: "Cardiology",
      room: "101",
      specialization: "Cardiologist",
      status: "Available",
      experience: "12 years",
      patients: 8,
    },
    {
      id: 2,
      name: "Dr. Priya Deshmukh",
      initials: "PD",
      department: "General Medicine",
      room: "102",
      specialization: "General Physician",
      status: "Available",
      experience: "9 years",
      patients: 12,
    },
    {
      id: 3,
      name: "Dr. Rahul Patil",
      initials: "RP",
      department: "Orthopedics",
      room: "103",
      specialization: "Orthopedic Specialist",
      status: "Busy",
      experience: "15 years",
      patients: 6,
    },
    {
      id: 4,
      name: "Dr. Sneha Kulkarni",
      initials: "SK",
      department: "Dermatology",
      room: "104",
      specialization: "Dermatologist",
      status: "Available",
      experience: "7 years",
      patients: 5,
    },
    {
      id: 5,
      name: "Dr. Rajesh Joshi",
      initials: "RJ",
      department: "Neurology",
      room: "105",
      specialization: "Neurologist",
      status: "On Break",
      experience: "18 years",
      patients: 4,
    },
    {
      id: 6,
      name: "Dr. Neha More",
      initials: "NM",
      department: "Pediatrics",
      room: "106",
      specialization: "Pediatrician",
      status: "Available",
      experience: "10 years",
      patients: 9,
    },
  ];

  const departments = [
    ...new Set(
      doctors.map((doctor) => doctor.department)
    ),
  ];

  const filteredDoctors = doctors.filter(
    (doctor) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        doctor.name
          .toLowerCase()
          .includes(searchValue) ||
        doctor.department
          .toLowerCase()
          .includes(searchValue) ||
        doctor.specialization
          .toLowerCase()
          .includes(searchValue);

      const matchesDepartment =
        department === "All" ||
        doctor.department === department;

      return (
        matchesSearch &&
        matchesDepartment
      );
    }
  );

  const availableDoctors = doctors.filter(
    (doctor) =>
      doctor.status === "Available"
  ).length;

  const busyDoctors = doctors.filter(
    (doctor) =>
      doctor.status === "Busy"
  ).length;

  return (
    <div className="doctors-page">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-text">
              Hospital Management
            </p>

            <h1>Doctors</h1>
          </div>

          <div className="profile">
            <div className="notification">
              🔔
            </div>

            <div className="profile-avatar">
              HS
            </div>

            <div className="profile-info">
              <strong>
                Hospital Staff
              </strong>

              <span>
                Reception Desk
              </span>
            </div>
          </div>
        </header>

        <section className="queue-summary">
          <div className="queue-summary-card">
            <span>Total Doctors</span>
            <strong>
              {doctors.length}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>Available</span>
            <strong>
              {availableDoctors}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>Busy</span>
            <strong>
              {busyDoctors}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>Departments</span>
            <strong>
              {departments.length}
            </strong>
          </div>
        </section>

        <section className="card doctors-card">
          <div className="waiting-header">
            <div>
              <p className="section-label">
                MEDICAL STAFF
              </p>

              <h2>Doctor List</h2>
            </div>

            <div className="queue-controls">
              <input
                type="text"
                placeholder="Search doctor..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

              <select
                value={department}
                onChange={(event) =>
                  setDepartment(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Departments
                </option>

                {departments.map(
                  (item) => (
                    <option
                      value={item}
                      key={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="queue-table">
            <div className="queue-table-row queue-table-heading">
              <span>Doctor</span>
              <span>Department</span>
              <span>Specialization</span>
              <span>Room</span>
              <span>Status</span>
              <span>Patients</span>
              <span>Action</span>
            </div>

            {filteredDoctors.map(
              (doctor) => (
                <div
                  className="queue-table-row"
                  key={doctor.id}
                >
                  <div className="queue-patient-cell">
                    <div className="small-avatar">
                      {doctor.initials}
                    </div>

                    <strong>
                      {doctor.name}
                    </strong>
                  </div>

                  <span>
                    {doctor.department}
                  </span>

                  <span>
                    {doctor.specialization}
                  </span>

                  <span>
                    {doctor.room}
                  </span>

                  <span>
                    <span
                      className={`waiting-badge ${
                        doctor.status ===
                        "Available"
                          ? "doctor-available"
                          : doctor.status ===
                            "Busy"
                          ? "doctor-busy"
                          : "doctor-break"
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </span>

                  <span>
                    {doctor.patients}
                  </span>

                  <button
                    className="call-button"
                    onClick={() =>
                      setSelectedDoctor(
                        doctor
                      )
                    }
                  >
                    View
                  </button>
                </div>
              )
            )}

            {filteredDoctors.length ===
              0 && (
              <div className="queue-empty">
                No doctors found.
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedDoctor && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedDoctor(null)
          }
        >
          <div
            className="doctor-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <p className="section-label">
                  DOCTOR DETAILS
                </p>

                <h2>
                  {selectedDoctor.name}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedDoctor(null)
                }
              >
                ×
              </button>
            </div>

            <div className="doctor-modal-profile">
              <div className="doctor-large-avatar">
                {selectedDoctor.initials}
              </div>

              <div>
                <h3>
                  {selectedDoctor.name}
                </h3>

                <p>
                  {
                    selectedDoctor.specialization
                  }
                </p>
              </div>
            </div>

            <div className="doctor-details-grid">
              <div>
                <span>
                  Department
                </span>

                <strong>
                  {
                    selectedDoctor.department
                  }
                </strong>
              </div>

              <div>
                <span>
                  Room Number
                </span>

                <strong>
                  {selectedDoctor.room}
                </strong>
              </div>

              <div>
                <span>
                  Experience
                </span>

                <strong>
                  {
                    selectedDoctor.experience
                  }
                </strong>
              </div>

              <div>
                <span>
                  Current Patients
                </span>

                <strong>
                  {
                    selectedDoctor.patients
                  }
                </strong>
              </div>

              <div>
                <span>
                  Current Status
                </span>

                <strong>
                  {
                    selectedDoctor.status
                  }
                </strong>
              </div>
            </div>

            <button
              className="secondary-button modal-done-button"
              onClick={() =>
                setSelectedDoctor(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;