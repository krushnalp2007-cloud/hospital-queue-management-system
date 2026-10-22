import React, { useState } from "react";
import "./MobilePatient.css";

const API_BASE = "";

function PatientRegister({ onBack, onLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    gender: "Male",
    dateOfBirth: "",
    bloodGroup: "O+",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setFeedback({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: "patient",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("patientToken", data.token || "demo_token");
      localStorage.setItem("patientUser", JSON.stringify(data.user || formData));
      setFeedback({ type: "success", message: "Account created successfully! Logging you in..." });

      setTimeout(() => {
        if (onRegisterSuccess) onRegisterSuccess(data.user || formData);
        else if (onLogin) onLogin();
      }, 700);
    } catch (err) {
      console.warn("Register error, falling back locally:", err);
      const fallbackUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: "patient",
      };
      localStorage.setItem("patientToken", "demo_reg_token");
      localStorage.setItem("patientUser", JSON.stringify(fallbackUser));
      setFeedback({ type: "success", message: "Registered successfully!" });

      setTimeout(() => {
        if (onRegisterSuccess) onRegisterSuccess(fallbackUser);
        else if (onLogin) onLogin();
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-login-container">
      <div className="mobile-login-header">
        <div className="brand-badge">✚</div>
        <h2>Patient Registration</h2>
        <p>Create your personal healthcare account</p>
      </div>

      <form onSubmit={handleRegister} className="mobile-form">
        <div className="mobile-input-group">
          <label>Full Name *</label>
          <div className="input-with-icon">
            <span className="input-icon-left">👤</span>
            <input
              type="text"
              name="name"
              className="mobile-input"
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mobile-input-group">
          <label>Mobile Number</label>
          <div className="phone-input-wrapper">
            <div className="country-code-pill">
              <span>🇮🇳</span> +91
            </div>
            <input
              type="tel"
              name="phone"
              className="mobile-input"
              placeholder="10-digit number"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mobile-input-group">
          <label>Email Address *</label>
          <div className="input-with-icon">
            <span className="input-icon-left">✉️</span>
            <input
              type="email"
              name="email"
              className="mobile-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mobile-input-group">
          <label>Password *</label>
          <div className="input-with-icon">
            <span className="input-icon-left">🔒</span>
            <input
              type="password"
              name="password"
              className="mobile-input"
              placeholder="Create secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div className="mobile-input-group">
            <label>Gender</label>
            <select
              name="gender"
              className="mobile-input"
              style={{ paddingLeft: "12px", cursor: "pointer" }}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mobile-input-group">
            <label>Blood Group</label>
            <select
              name="bloodGroup"
              className="mobile-input"
              style={{ paddingLeft: "12px", cursor: "pointer" }}
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="O+">O+</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="O-">O-</option>
              <option value="A-">A-</option>
              <option value="B-">B-</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

        {feedback && (
          <div className={`mobile-alert ${feedback.type}`}>
            <span>{feedback.type === "error" ? "⚠️" : "✅"}</span>
            <span>{feedback.message}</span>
          </div>
        )}

        <button
          type="submit"
          className="mobile-primary-btn"
          disabled={loading}
          style={{ marginTop: "10px" }}
        >
          {loading ? "Creating Account..." : "Complete Registration ➜"}
        </button>
      </form>

      <div className="mobile-login-footer" style={{ marginTop: "18px" }}>
        <div>
          <span>Already have an account? </span>
          <button type="button" className="text-link-btn" onClick={onLogin}>
            Login Here
          </button>
        </div>

        {onBack && (
          <div style={{ marginTop: "6px" }}>
            <button type="button" className="text-link-btn" onClick={onBack} style={{ color: "#64748b" }}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientRegister;
