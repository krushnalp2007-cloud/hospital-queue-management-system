import { useState } from "react";
import "./App.css";
import QueueManagement from "./QueueManagement";

const initialPatients = [
  {
    token: 104,
    name: "Rahul Patil",
    department: "General Medicine",
    room: "Room 102",
    initials: "RP",
  },
  {
    token: 105,
    name: "Priya Shah",
    department: "General Medicine",
    room: "Room 102",
    initials: "PS",
  },
  {
    token: 106,
    name: "Amit Kulkarni",
    department: "Cardiology",
    room: "Room 104",
    initials: "AK",
  },
  {
    token: 107,
    name: "Neha Joshi",
    department: "General Medicine",
    room: "Room 102",
    initials: "NJ",
  },
  {
    token: 108,
    name: "Rohan Deshmukh",
    department: "Orthopedics",
    room: "Room 105",
    initials: "RD",
  },
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [patients] = useState(initialPatients);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedPatients, setCompletedPatients] = useState(28);

  const currentPatient = patients[currentIndex];

  const upcomingPatients = patients.slice(currentIndex + 1);

  const waitingPatients = upcomingPatients.length;

  const handleNextPatient = () => {
    if (currentIndex < patients.length - 1) {
      setCurrentIndex((index) => index + 1);
      setCompletedPatients((count) => count + 1);
    }
  };

  const handleComplete = () => {
    if (currentIndex < patients.length - 1) {
      setCompletedPatients((count) => count + 1);
      setCurrentIndex((index) => index + 1);
    }
  };

  /*
   * Show Queue Management page
   */

  if (activePage === "queue") {
    return (
      <QueueManagement
        patients={patients}
        currentIndex={currentIndex}
        onNext={handleNextPatient}
        onComplete={handleComplete}
        onBack={() => setActivePage("dashboard")}
      />
    );
  }

  /*
   * Dashboard
   */

  return (
    <div className="app">
      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">+</div>

          <div>
            <h2>MediQueue</h2>
            <span>Hospital System</span>
          </div>
        </div>

        <nav className="navigation">
          <button
            className="nav-item active"
            onClick={() => setActivePage("dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => setActivePage("queue")}
          >
            <span>☷</span>
            Queue Management
          </button>

          <button className="nav-item">
            <span>♙</span>
            Patients
          </button>

          <button className="nav-item">
            <span>⚕</span>
            Doctors
          </button>

          <button className="nav-item">
            <span>◷</span>
            Appointments
          </button>

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            System Online
          </div>

          <button className="logout-button">
            ⇥ Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">
        {/* ================= HEADER ================= */}

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

        {/* ================= STATISTICS ================= */}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              ♙
            </div>

            <div>
              <p>
                Total Patients
              </p>

              <h2>
                42
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
              <p>
                Waiting
              </p>

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
              <p>
                Completed
              </p>

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
              <p>
                Avg. Wait Time
              </p>

              <h2>
                18 min
              </h2>

              <span className="positive">
                -5 min today
              </span>
            </div>
          </div>
        </section>

        {/* ================= DASHBOARD ================= */}

        <section className="dashboard-grid">
          {/* CURRENT PATIENT */}

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
              <span>
                Token
              </span>

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
                onClick={handleNextPatient}
                disabled={
                  currentIndex >= patients.length - 1
                }
              >
                Call Next Patient →
              </button>

              <button
                className="secondary-button"
                onClick={handleComplete}
                disabled={
                  currentIndex >= patients.length - 1
                }
              >
                ✓ Mark Completed
              </button>
            </div>
          </div>

          {/* UPCOMING QUEUE */}

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
                onClick={() => setActivePage("queue")}
              >
                View All →
              </button>
            </div>

            <div className="queue-list">
              {upcomingPatients.length > 0 ? (
                upcomingPatients.map((patient) => (
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
                ))
              ) : (
                <div className="empty-queue">
                  No patients waiting
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= BOTTOM SECTION ================= */}

        <section className="bottom-grid">
          {/* DEPARTMENTS */}

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

          {/* QUICK ACTION */}

          <div className="card quick-card">
            <p className="section-label">
              QUICK ACTION
            </p>

            <h2>
              Manage Queue
            </h2>

            <p>
              Quickly control patient flow from the
              reception desk.
            </p>

            <button
              className="primary-button"
              onClick={() => setActivePage("queue")}
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