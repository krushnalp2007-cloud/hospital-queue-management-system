import { useState } from "react";
import "./App.css";
import QueueManagement from "./QueueManagement";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import EmergencyHandling from "./EmergencyHandling";
import Sidebar from "./Sidebar";
import initialPatients from "./data/patients";

function App() {
  const [activePage, setActivePage] =
    useState("dashboard");

  const [patients] =
    useState(initialPatients);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [completedTokens, setCompletedTokens] =
    useState(new Set());

  const initialCompletedCount = 28;

  const currentPatient =
    patients[currentIndex];

  const waitingPatientsList =
    patients.filter(
      (patient, index) =>
        index !== currentIndex &&
        !completedTokens.has(patient.token)
    );

  const waitingPatients =
    waitingPatientsList.length;

  const navigate = (page) => {
    if (page === "patients") {
      return;
    }

    if (page === "settings") {
      return;
    }

    setActivePage(page);
  };

  const handleNextPatient = () => {
    const nextPatientIndex =
      patients.findIndex(
        (patient, index) =>
          index !== currentIndex &&
          !completedTokens.has(patient.token)
      );

    if (nextPatientIndex !== -1) {
      setCurrentIndex(nextPatientIndex);
    }
  };

  const handleCallPatient = (
    patientIndex
  ) => {
    if (
      patientIndex >= 0 &&
      patientIndex < patients.length &&
      !completedTokens.has(
        patients[patientIndex].token
      )
    ) {
      setCurrentIndex(patientIndex);
    }
  };

  const handleComplete = () => {
    if (!currentPatient) {
      return;
    }

    const completedToken =
      currentPatient.token;

    setCompletedTokens(
      (previousTokens) => {
        const updatedTokens =
          new Set(previousTokens);

        updatedTokens.add(
          completedToken
        );

        return updatedTokens;
      }
    );

    const nextPatientIndex =
      patients.findIndex(
        (patient, index) =>
          index !== currentIndex &&
          !completedTokens.has(
            patient.token
          )
      );

    if (nextPatientIndex !== -1) {
      setCurrentIndex(nextPatientIndex);
    }
  };

  const completedPatients =
    initialCompletedCount +
    completedTokens.size;

  const upcomingPatients =
    waitingPatientsList.slice(0, 4);

  if (!currentPatient) {
    return (
      <div className="app">
        <div className="empty-queue">
          No patient data available.
        </div>
      </div>
    );
  }

  /* QUEUE */
  if (activePage === "queue") {
    return (
      <QueueManagement
        patients={patients}
        currentIndex={currentIndex}
        completedTokens={completedTokens}
        onNext={handleNextPatient}
        onComplete={handleComplete}
        onCallPatient={handleCallPatient}
        activePage="queue"
        onNavigate={navigate}
      />
    );
  }

  /* DOCTORS */
  if (activePage === "doctors") {
    return (
      <Doctors
        activePage="doctors"
        onNavigate={navigate}
      />
    );
  }

  /* APPOINTMENTS */
  if (activePage === "appointments") {
    return (
      <Appointments
        activePage="appointments"
        onNavigate={navigate}
      />
    );
  }

  /* EMERGENCY */
  if (activePage === "emergency") {
    return (
      <EmergencyHandling
        activePage="emergency"
        onNavigate={navigate}
      />
    );
  }

  /* DASHBOARD */
  return (
    <div className="app">
      <Sidebar
        activePage="dashboard"
        onNavigate={navigate}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="welcome-text">
              Good Morning 👋
            </p>

            <h1>
              Hospital Dashboard
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

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              ♙
            </div>

            <div>
              <p>Total Patients</p>

              <h2>
                {patients.length}
              </h2>

              <span className="positive">
                Today's patients
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              ☷
            </div>

            <div>
              <p>Waiting</p>

              <h2>
                {waitingPatients}
              </h2>

              <span className="warning">
                Currently waiting
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <p>Completed</p>

              <h2>
                {completedPatients}
              </h2>

              <span className="positive">
                Consultations done
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              ◷
            </div>

            <div>
              <p>Avg. Wait Time</p>

              <h2>
                18 min
              </h2>

              <span className="positive">
                -5 min today
              </span>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card current-card">
            <div className="card-header">
              <div>
                <p className="section-label">
                  CURRENT TOKEN
                </p>

                <h2>
                  Now Serving
                </h2>
              </div>

              <span className="live-badge">
                ● LIVE
              </span>
            </div>

            <div className="token-display">
              <span>Token</span>

              <strong>
                #{currentPatient.token}
              </strong>
            </div>

            <div className="patient-info">
              <div className="patient-avatar">
                {currentPatient.initials}
              </div>

              <div>
                <h3>
                  {currentPatient.name}
                </h3>

                <p>
                  {currentPatient.department}
                  {" • "}
                  {currentPatient.room}
                </p>
              </div>
            </div>

            <div className="consultation-status">
              <span className="status-dot"></span>
              In Consultation
            </div>

            <div className="action-buttons">
              <button
                className="primary-button"
                onClick={
                  handleNextPatient
                }
                disabled={
                  waitingPatients === 0
                }
              >
                Call Next Patient →
              </button>

              <button
                className="secondary-button"
                onClick={handleComplete}
              >
                ✓ Mark Completed
              </button>
            </div>
          </div>

          <div className="card queue-card">
            <div className="card-header">
              <div>
                <p className="section-label">
                  PATIENT QUEUE
                </p>

                <h2>
                  Upcoming Patients
                </h2>
              </div>

              <button
                className="view-all"
                onClick={() =>
                  navigate("queue")
                }
              >
                View All →
              </button>
            </div>

            <div className="queue-list">
              {upcomingPatients.length >
              0 ? (
                upcomingPatients.map(
                  (patient) => (
                    <div
                      className="queue-row"
                      key={patient.token}
                    >
                      <span className="queue-token">
                        #{patient.token}
                      </span>

                      <div className="queue-patient">
                        <strong>
                          {patient.name}
                        </strong>

                        <span>
                          {patient.department}
                        </span>
                      </div>

                      <span className="waiting-badge">
                        Waiting
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="empty-queue">
                  No patients waiting
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <p className="section-label">
                  DEPARTMENTS
                </p>

                <h2>
                  Department Queue
                </h2>
              </div>
            </div>

            <div className="department-list">
              <div className="department-row">
                <span>
                  General Medicine
                </span>

                <strong>
                  08 waiting
                </strong>
              </div>

              <div className="department-row">
                <span>
                  Cardiology
                </span>

                <strong>
                  03 waiting
                </strong>
              </div>

              <div className="department-row">
                <span>
                  Orthopedics
                </span>

                <strong>
                  01 waiting
                </strong>
              </div>
            </div>
          </div>

          <div className="card quick-card">
            <p className="section-label">
              QUICK ACTION
            </p>

            <h2>
              Manage Queue
            </h2>

            <p>
              Quickly control patient flow
              from the reception desk.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("queue")
              }
            >
              Open Queue Management →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;