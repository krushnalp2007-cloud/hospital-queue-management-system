function Sidebar({
  activePage,
  onNavigate,
}) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          +
        </div>

        <div>
          <h2>MediQueue</h2>

          <span>
            Hospital System
          </span>
        </div>
      </div>

      <nav className="navigation">
        <button
          className={`nav-item ${
            activePage === "dashboard"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("dashboard")
          }
        >
          <span>▦</span>
          Dashboard
        </button>

        <button
          className={`nav-item ${
            activePage === "queue"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("queue")
          }
        >
          <span>☷</span>
          Queue Management
        </button>

        <button
          className="nav-item"
          onClick={() =>
            onNavigate("patients")
          }
        >
          <span>♙</span>
          Patients
        </button>

        <button
          className={`nav-item ${
            activePage === "doctors"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("doctors")
          }
        >
          <span>⚕</span>
          Doctors
        </button>

        <button
          className={`nav-item ${
            activePage === "appointments"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("appointments")
          }
        >
          <span>◷</span>
          Appointments
        </button>

        <button
          className={`nav-item ${
            activePage === "emergency"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onNavigate("emergency")
          }
        >
          <span>🚨</span>
          Emergency
        </button>

        <button
          className="nav-item"
          onClick={() =>
            onNavigate("settings")
          }
        >
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
  );
}

export default Sidebar;