import { useState } from "react";
import "./EmergencyHandling.css";
import Sidebar from "./Sidebar";

function EmergencyHandling({
  activePage,
  onNavigate,
}) {
  const [emergencyActive, setEmergencyActive] =
    useState(false);

  const [selectedBed, setSelectedBed] =
    useState(null);

  const [assignedBed, setAssignedBed] =
    useState(null);

  const [showNotification, setShowNotification] =
    useState(false);

  const [beds, setBeds] = useState([
    {
      id: 1,
      name: "Bed 01",
      status: "Available",
    },
    {
      id: 2,
      name: "Bed 02",
      status: "Available",
    },
    {
      id: 3,
      name: "Bed 03",
      status: "Occupied",
    },
    {
      id: 4,
      name: "Bed 04",
      status: "Available",
    },
  ]);

  const emergencyPatient = {
    token: "E-201",
    name: "Emergency Patient",
    initials: "EP",
    condition: "Critical condition",
    arrival: "Just now",
  };

  const activateEmergency = () => {
    setEmergencyActive(true);
    setShowNotification(true);
  };

  const assignBed = () => {
    if (!selectedBed) {
      return;
    }

    setBeds((previousBeds) =>
      previousBeds.map((bed) =>
        bed.id === selectedBed
          ? {
              ...bed,
              status: "Occupied",
            }
          : bed
      )
    );

    setAssignedBed(selectedBed);
    setShowNotification(true);
  };

  const completeEmergency = () => {
    if (assignedBed) {
      setBeds((previousBeds) =>
        previousBeds.map((bed) =>
          bed.id === assignedBed
            ? {
                ...bed,
                status: "Available",
              }
            : bed
        )
      );
    }

    setEmergencyActive(false);
    setSelectedBed(null);
    setAssignedBed(null);
    setShowNotification(false);
  };

  const selectedBedData = beds.find(
    (bed) => bed.id === selectedBed
  );

  const assignedBedData = beds.find(
    (bed) => bed.id === assignedBed
  );

  return (
    <div className="emergency-page">
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

            <h1>Emergency Handling</h1>
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

        <section className="emergency-summary">
          <div className="emergency-summary-card">
            <span>Emergency Status</span>

            <strong
              className={
                emergencyActive
                  ? "emergency-active-text"
                  : "emergency-normal-text"
              }
            >
              {emergencyActive
                ? "Active"
                : "Normal"}
            </strong>
          </div>

          <div className="emergency-summary-card">
            <span>Available Beds</span>

            <strong>
              {
                beds.filter(
                  (bed) =>
                    bed.status ===
                    "Available"
                ).length
              }
            </strong>
          </div>

          <div className="emergency-summary-card">
            <span>Occupied Beds</span>

            <strong>
              {
                beds.filter(
                  (bed) =>
                    bed.status ===
                    "Occupied"
                ).length
              }
            </strong>
          </div>

          <div className="emergency-summary-card">
            <span>Queue Status</span>

            <strong
              className={
                emergencyActive
                  ? "emergency-delay-text"
                  : "emergency-normal-text"
              }
            >
              {emergencyActive
                ? "Delayed"
                : "Active"}
            </strong>
          </div>
        </section>

        {showNotification && (
          <div className="emergency-notification">
            <div className="emergency-notification-icon">
              🚨
            </div>

            <div>
              <strong>
                Emergency Alert
              </strong>

              <p>
                Emergency patient handling
                is active. Other patients in
                the queue are temporarily
                delayed.
              </p>
            </div>
          </div>
        )}

        <section className="card emergency-patient-card">
          <div className="card-header">
            <div>
              <p className="section-label">
                EMERGENCY PATIENT
              </p>

              <h2>
                Emergency Identification
              </h2>
            </div>

            {!emergencyActive && (
              <span className="emergency-badge">
                🚨 EMERGENCY
              </span>
            )}
          </div>

          <div className="emergency-patient-content">
            <div className="emergency-token">
              #{emergencyPatient.token}
            </div>

            <div className="emergency-patient-info">
              <div className="emergency-avatar">
                {emergencyPatient.initials}
              </div>

              <div>
                <h3>
                  {emergencyPatient.name}
                </h3>

                <p>
                  Condition:{" "}
                  {emergencyPatient.condition}
                </p>

                <p>
                  Arrival:{" "}
                  {emergencyPatient.arrival}
                </p>
              </div>
            </div>

            {!emergencyActive ? (
              <button
                className="emergency-primary-button"
                onClick={activateEmergency}
              >
                🚨 Activate Emergency
              </button>
            ) : (
              <button
                className="emergency-complete-button"
                onClick={completeEmergency}
              >
                ✓ Complete Emergency
              </button>
            )}
          </div>
        </section>

        <section className="card bed-management-card">
          <div className="card-header">
            <div>
              <p className="section-label">
                BED MANAGEMENT
              </p>

              <h2>
                Emergency Bed Availability
              </h2>
            </div>

            {assignedBedData && (
              <span className="assigned-bed-badge">
                {assignedBedData.name} Assigned
              </span>
            )}
          </div>

          <div className="beds-grid">
            {beds.map((bed) => {
              const isAvailable =
                bed.status === "Available";

              const isSelected =
                selectedBed === bed.id;

              const isAssigned =
                assignedBed === bed.id;

              return (
                <button
                  key={bed.id}
                  className={`bed-card ${
                    isAvailable
                      ? "bed-available"
                      : "bed-occupied"
                  } ${
                    isSelected
                      ? "bed-selected"
                      : ""
                  } ${
                    isAssigned
                      ? "bed-assigned"
                      : ""
                  }`}
                  disabled={
                    !isAvailable ||
                    assignedBed !== null
                  }
                  onClick={() =>
                    setSelectedBed(
                      bed.id
                    )
                  }
                >
                  <div className="bed-icon">
                    🛏️
                  </div>

                  <strong>
                    {bed.name}
                  </strong>

                  <span>
                    {isAssigned
                      ? "Assigned"
                      : bed.status}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedBedData &&
            selectedBedData.status ===
              "Available" &&
            !assignedBed && (
              <div className="bed-assignment-section">
                <p>
                  Selected:{" "}
                  <strong>
                    {
                      selectedBedData.name
                    }
                  </strong>
                </p>

                <button
                  className="primary-button"
                  onClick={assignBed}
                >
                  Assign Bed
                </button>
              </div>
            )}

          {assignedBedData && (
            <div className="assigned-bed-message">
              <strong>
                ✓ Emergency bed assigned
              </strong>

              <p>
                {
                  assignedBedData.name
                }{" "}
                is currently assigned to the
                emergency patient.
              </p>
            </div>
          )}
        </section>

        {emergencyActive && (
          <section className="card queue-delay-card">
            <div className="queue-delay-icon">
              ⏸
            </div>

            <div>
              <h2>
                Regular Queue Temporarily
                Delayed
              </h2>

              <p>
                Other patients are temporarily
                shown as waiting/delayed while
                the emergency case is being
                handled.
              </p>
            </div>

            <span className="delay-badge">
              Queue Delayed
            </span>
          </section>
        )}
      </main>
    </div>
  );
}

export default EmergencyHandling;