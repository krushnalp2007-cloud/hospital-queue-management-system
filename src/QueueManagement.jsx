import { useState } from "react";

function QueueManagement({
  patients,
  currentIndex,
  onNext,
  onComplete,
  onBack,
}) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const filteredPatients = patients.filter((patient, index) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.token.toString().includes(search);

    const matchesDepartment =
      department === "All" ||
      patient.department === department;

    return index >= currentIndex && matchesSearch && matchesDepartment;
  });

  return (
    <div className="queue-page">

      {/* Sidebar */}

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
            className="nav-item"
            onClick={onBack}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button className="nav-item active">
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


      {/* Main */}

      <main className="main-content">

        <header className="topbar">

          <div>
            <p className="welcome-text">
              Patient Flow
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


        {/* Queue summary */}

        <section className="queue-summary">

          <div className="queue-summary-card">
            <span>Current Token</span>
            <strong>
              #{patients[currentIndex]?.token}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>Waiting Patients</span>
            <strong>
              {Math.max(0, patients.length - currentIndex - 1)}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>Department</span>
            <strong>
              {patients[currentIndex]?.department}
            </strong>
          </div>

          <div className="queue-summary-card">
            <span>Average Wait</span>
            <strong>
              18 min
            </strong>
          </div>

        </section>


        {/* Current patient */}

        <section className="card queue-current-card">

          <div className="card-header">

            <div>
              <p className="section-label">
                NOW SERVING
              </p>

              <h2>
                Current Patient
              </h2>
            </div>

            <span className="live-badge">
              ● LIVE
            </span>

          </div>


          <div className="queue-current-content">

            <div className="queue-big-token">
              #{patients[currentIndex]?.token}
            </div>

            <div className="queue-current-patient">

              <div className="patient-avatar">
                {patients[currentIndex]?.initials}
              </div>

              <div>
                <h3>
                  {patients[currentIndex]?.name}
                </h3>

                <p>
                  {patients[currentIndex]?.department}
                  {" • "}
                  {patients[currentIndex]?.room}
                </p>
              </div>

            </div>


            <div className="queue-current-actions">

              <button
                className="primary-button"
                onClick={onNext}
                disabled={currentIndex >= patients.length - 1}
              >
                Call Next Patient →
              </button>

              <button
                className="secondary-button"
                onClick={onComplete}
                disabled={currentIndex >= patients.length - 1}
              >
                ✓ Mark Completed
              </button>

            </div>

          </div>

        </section>


        {/* Search and filter */}

        <section className="card queue-table-card">

          <div className="queue-table-header">

            <div>
              <p className="section-label">
                PATIENTS
              </p>

              <h2>
                Waiting Queue
              </h2>
            </div>

            <div className="queue-controls">

              <input
                type="text"
                placeholder="Search token or patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="All">
                  All Departments
                </option>

                <option value="General Medicine">
                  General Medicine
                </option>

                <option value="Cardiology">
                  Cardiology
                </option>

                <option value="Orthopedics">
                  Orthopedics
                </option>
              </select>

            </div>

          </div>


          <div className="queue-table">

            <div className="queue-table-row queue-table-heading">

              <span>Token</span>
              <span>Patient</span>
              <span>Department</span>
              <span>Room</span>
              <span>Status</span>
              <span>Action</span>

            </div>


            {filteredPatients.map((patient) => {

              const actualIndex = patients.findIndex(
                (item) => item.token === patient.token
              );

              const isCurrent =
                actualIndex === currentIndex;

              return (
                <div
                  className="queue-table-row"
                  key={patient.token}
                >

                  <strong className="table-token">
                    #{patient.token}
                  </strong>

                  <div className="table-patient">

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
                    {patient.room}
                  </span>

                  <span>
                    <span
                      className={
                        isCurrent
                          ? "current-status"
                          : "waiting-badge"
                      }
                    >
                      {isCurrent
                        ? "In Consultation"
                        : "Waiting"}
                    </span>
                  </span>

                  <button
                    className="table-action"
                    onClick={() => {
                      if (!isCurrent) {
                        onNext();
                      }
                    }}
                  >
                    {isCurrent ? "Current" : "Call"}
                  </button>

                </div>
              );
            })}


            {filteredPatients.length === 0 && (

              <div className="empty-queue">
                No patients found
              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default QueueManagement;