import { useState } from "react";
import "./Appointments.css";
import Sidebar from "./Sidebar";

function Appointments({
  activePage,
  onNavigate,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const appointments = [
    {
      id: 1,
      token: "A-101",
      patient: "Rahul Patil",
      initials: "RP",
      doctor: "Dr. Amit Sharma",
      department: "Cardiology",
      date: "04 Sep 2026",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      token: "A-102",
      patient: "Sneha Joshi",
      initials: "SJ",
      doctor: "Dr. Priya Deshmukh",
      department: "General Medicine",
      date: "04 Sep 2026",
      time: "10:30 AM",
      status: "Waiting",
    },
    {
      id: 3,
      token: "A-103",
      patient: "Amit Kulkarni",
      initials: "AK",
      doctor: "Dr. Rahul Patil",
      department: "Orthopedics",
      date: "04 Sep 2026",
      time: "11:00 AM",
      status: "Confirmed",
    },
    {
      id: 4,
      token: "A-104",
      patient: "Pooja More",
      initials: "PM",
      doctor: "Dr. Sneha Kulkarni",
      department: "Dermatology",
      date: "04 Sep 2026",
      time: "11:30 AM",
      status: "Completed",
    },
    {
      id: 5,
      token: "A-105",
      patient: "Vikas Desai",
      initials: "VD",
      doctor: "Dr. Rajesh Joshi",
      department: "Neurology",
      date: "04 Sep 2026",
      time: "12:00 PM",
      status: "Cancelled",
    },
    {
      id: 6,
      token: "A-106",
      patient: "Neha Patil",
      initials: "NP",
      doctor: "Dr. Neha More",
      department: "Pediatrics",
      date: "04 Sep 2026",
      time: "12:30 PM",
      status: "Confirmed",
    },
  ];

  const filteredAppointments =
    appointments.filter((appointment) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        appointment.patient
          .toLowerCase()
          .includes(searchValue) ||
        appointment.doctor
          .toLowerCase()
          .includes(searchValue) ||
        appointment.department
          .toLowerCase()
          .includes(searchValue) ||
        appointment.token
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const confirmedCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "Confirmed"
    ).length;

  const waitingCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "Waiting"
    ).length;

  const completedCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "Completed"
    ).length;

  return (
    <div className="appointments-page">
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

            <h1>Appointments</h1>
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
            <span>
              Total Appointments
            </span>

            <strong>
              {appointments.length}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>Confirmed</span>

            <strong>
              {confirmedCount}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>Waiting</span>

            <strong>
              {waitingCount}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>Completed</span>

            <strong>
              {completedCount}
            </strong>
          </div>
        </section>

        <section className="card appointments-card">
          <div className="waiting-header">
            <div>
              <p className="section-label">
                APPOINTMENT SCHEDULE
              </p>

              <h2>
                Today's Appointments
              </h2>
            </div>

            <div className="queue-controls">
              <input
                type="text"
                placeholder="Search appointment..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Waiting">
                  Waiting
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>
          </div>

          <div className="queue-table">
            <div className="queue-table-row queue-table-heading">
              <span>Token</span>
              <span>Patient</span>
              <span>Doctor</span>
              <span>Department</span>
              <span>Date</span>
              <span>Time</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {filteredAppointments.map(
              (appointment) => (
                <div
                  className="queue-table-row"
                  key={appointment.id}
                >
                  <span className="queue-token">
                    {appointment.token}
                  </span>

                  <div className="queue-patient-cell">
                    <div className="small-avatar">
                      {appointment.initials}
                    </div>

                    <strong>
                      {appointment.patient}
                    </strong>
                  </div>

                  <span>
                    {appointment.doctor}
                  </span>

                  <span>
                    {appointment.department}
                  </span>

                  <span>
                    {appointment.date}
                  </span>

                  <span>
                    {appointment.time}
                  </span>

                  <span>
                    <span
                      className={`waiting-badge ${
                        appointment.status ===
                        "Confirmed"
                          ? "appointment-confirmed"
                          : appointment.status ===
                            "Waiting"
                          ? "appointment-waiting"
                          : appointment.status ===
                            "Completed"
                          ? "appointment-completed"
                          : "appointment-cancelled"
                      }`}
                    >
                      {
                        appointment.status
                      }
                    </span>
                  </span>

                  <button
                    className="call-button"
                    onClick={() =>
                      setSelectedAppointment(
                        appointment
                      )
                    }
                  >
                    View
                  </button>
                </div>
              )
            )}

            {filteredAppointments.length ===
              0 && (
              <div className="queue-empty">
                No appointments found.
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedAppointment && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedAppointment(
              null
            )
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
                  APPOINTMENT DETAILS
                </p>

                <h2>
                  {
                    selectedAppointment.patient
                  }
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedAppointment(
                    null
                  )
                }
              >
                ×
              </button>
            </div>

            <div className="doctor-modal-profile">
              <div className="doctor-large-avatar">
                {
                  selectedAppointment.initials
                }
              </div>

              <div>
                <h3>
                  {
                    selectedAppointment.patient
                  }
                </h3>

                <p>
                  Token:{" "}
                  {
                    selectedAppointment.token
                  }
                </p>
              </div>
            </div>

            <div className="doctor-details-grid">
              <div>
                <span>
                  Doctor
                </span>

                <strong>
                  {
                    selectedAppointment.doctor
                  }
                </strong>
              </div>

              <div>
                <span>
                  Department
                </span>

                <strong>
                  {
                    selectedAppointment.department
                  }
                </strong>
              </div>

              <div>
                <span>Date</span>

                <strong>
                  {
                    selectedAppointment.date
                  }
                </strong>
              </div>

              <div>
                <span>Time</span>

                <strong>
                  {
                    selectedAppointment.time
                  }
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  {
                    selectedAppointment.status
                  }
                </strong>
              </div>

              <div>
                <span>
                  Appointment ID
                </span>

                <strong>
                  #{selectedAppointment.id}
                </strong>
              </div>
            </div>

            <button
              className="secondary-button modal-done-button"
              onClick={() =>
                setSelectedAppointment(
                  null
                )
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

export default Appointments;