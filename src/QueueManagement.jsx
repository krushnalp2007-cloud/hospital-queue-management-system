import { useState } from "react";
import "./QueueManagement.css";
import Sidebar from "./Sidebar";

function QueueManagement({
  patients,
  currentIndex,
  completedTokens,
  onNext,
  onComplete,
  onCallPatient,
  onNavigate,
}) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState("All");

  const currentPatient =
    patients[currentIndex];

  const waitingPatients = patients.filter(
    (patient, index) =>
      index !== currentIndex &&
      !completedTokens.has(patient.token)
  );

  const filteredPatients =
    waitingPatients.filter((patient) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        patient.name
          .toLowerCase()
          .includes(searchValue) ||
        patient.token
          .toString()
          .includes(searchValue);

      const matchesDepartment =
        department === "All" ||
        patient.department === department;

      return (
        matchesSearch &&
        matchesDepartment
      );
    });

  const departments = [
    ...new Set(
      patients.map(
        (patient) => patient.department
      )
    ),
  ];

  return (
    <div className="queue-page">
      <Sidebar
        activePage="queue"
        onNavigate={onNavigate}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-text">
              Hospital Management
            </p>

            <h1>
              Queue Management
            </h1>
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
              Current Token
            </span>

            <strong>
              #{currentPatient.token}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>
              Waiting
            </span>

            <strong>
              {waitingPatients.length}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>
              Departments
            </span>

            <strong>
              {departments.length}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>
              Queue Status
            </span>

            <strong className="queue-active">
              Active
            </strong>
          </div>
        </section>

        <section className="card current-queue-card">
          <div className="card-header">
            <div>
              <p className="section-label">
                CURRENT PATIENT
              </p>

              <h2>
                Now Serving
              </h2>
            </div>

            <span className="live-badge">
              ● LIVE
            </span>
          </div>

          <div className="current-patient-content">
            <div className="queue-token-large">
              #{currentPatient.token}
            </div>

            <div className="current-patient-info">
              <div className="patient-avatar">
                {currentPatient.initials}
              </div>

              <div>
                <h3>
                  {currentPatient.name}
                </h3>

                <p>
                  {currentPatient.department}
                  {" • Room "}
                  {currentPatient.room}
                </p>
              </div>
            </div>

            <div className="queue-actions">
              <button
                className="primary-button"
                onClick={onNext}
                disabled={
                  waitingPatients.length ===
                  0
                }
              >
                Call Next Patient →
              </button>

              <button
                className="secondary-button"
                onClick={onComplete}
              >
                ✓ Mark Completed
              </button>
            </div>
          </div>
        </section>

        <section className="card waiting-queue-card">
          <div className="waiting-header">
            <div>
              <p className="section-label">
                QUEUE
              </p>

              <h2>
                Waiting Patients
              </h2>
            </div>

            <div className="queue-controls">
              <input
                type="text"
                placeholder="Search patient..."
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
              <span>Token</span>
              <span>Patient</span>
              <span>Department</span>
              <span>Doctor</span>
              <span>Room</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {filteredPatients.map(
              (patient) => {
                const actualIndex =
                  patients.findIndex(
                    (item) =>
                      item.token ===
                      patient.token
                  );

                return (
                  <div
                    className="queue-table-row"
                    key={patient.token}
                  >
                    <span className="queue-token">
                      #{patient.token}
                    </span>

                    <div className="queue-patient-cell">
                      <div className="small-avatar">
                        {patient.initials}
                      </div>

                      <strong>
                        {patient.name}
                      </strong>
                    </div>

                    <span>
                      {patient.department}
                    </span>

                    <span>
                      {patient.doctor}
                    </span>

                    <span>
                      {patient.room}
                    </span>

                    <span>
                      <span className="waiting-badge">
                        Waiting
                      </span>
                    </span>

                    <button
                      className="call-button"
                      onClick={() =>
                        onCallPatient(
                          actualIndex
                        )
                      }
                    >
                      Call
                    </button>
                  </div>
                );
              }
            )}

            {filteredPatients.length ===
              0 && (
              <div className="queue-empty">
                No waiting patients found.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default QueueManagement;