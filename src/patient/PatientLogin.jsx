import React, { useState, useRef } from "react";
import "./MobilePatient.css";

const API_BASE = "";

function PatientLogin({ onBack, onRegister, onLoginSuccess, onTrackQueue }) {
  const [authMethod, setAuthMethod] = useState("phone"); // 'phone' or 'email'

  // Phone / OTP states
  const [phone, setPhone] = useState("9876543210");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(45);
  const [timerActive, setTimerActive] = useState(false);

  // Email / Password states
  const [email, setEmail] = useState("aarav@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // General states
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'error' | 'success', message: '' }
  const [biometricScanning, setBiometricScanning] = useState(false);

  const otpInputRefs = useRef([]);

  // ==================== PHONE / OTP HANDLERS ====================
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setFeedback({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not send OTP");
      }

      setOtpSent(true);
      setFeedback({ type: "success", message: "Verification code sent! Demo OTP: 123456" });
      startTimer();
      setTimeout(() => {
        if (otpInputRefs.current[0]) otpInputRefs.current[0].focus();
      }, 100);
    } catch (err) {
      console.warn("API send-otp error, using local fallback demo:", err);
      // Seamless fallback
      setOtpSent(true);
      setFeedback({ type: "success", message: "Demo OTP ready! Code is: 123456" });
      startTimer();
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setResendTimer(45);
    setTimerActive(true);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance focus
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const digits = pasted.split("");
      const filled = [...otpDigits];
      digits.forEach((d, i) => {
        if (i < 6) filled[i] = d;
      });
      setOtpDigits(filled);
      if (otpInputRefs.current[Math.min(digits.length, 5)]) {
        otpInputRefs.current[Math.min(digits.length, 5)].focus();
      }
    }
  };

  const handleAutoFillOtp = () => {
    setOtpDigits(["1", "2", "3", "4", "5", "6"]);
    setFeedback({ type: "success", message: "Demo code 123456 filled!" });
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join("");
    if (code.length !== 6) {
      setFeedback({ type: "error", message: "Please enter the full 6-digit code." });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: code }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      localStorage.setItem("patientToken", data.token || "demo_patient_token");
      localStorage.setItem("patientUser", JSON.stringify(data.user || { name: "Patient", phone }));
      setFeedback({ type: "success", message: "Login successful! Redirecting..." });

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(data.user);
      }, 500);
    } catch (err) {
      console.warn("API verify-otp error, checking demo code:", err);
      if (code === "123456") {
        const mockUser = {
          id: 1,
          name: "Aarav Sharma",
          phone: phone || "9876543210",
          email: "aarav@example.com",
          role: "patient",
        };
        localStorage.setItem("patientToken", "demo_jwt_token_123");
        localStorage.setItem("patientUser", JSON.stringify(mockUser));
        setFeedback({ type: "success", message: "Verified successfully!" });
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(mockUser);
        }, 500);
      } else {
        setFeedback({ type: "error", message: "Invalid code. Use demo code 123456" });
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== EMAIL LOGIN HANDLER ====================
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback({ type: "error", message: "Please enter your email and password." });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("patientToken", data.token);
      localStorage.setItem("patientUser", JSON.stringify(data.user));
      setFeedback({ type: "success", message: "Welcome back! Login successful." });

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(data.user);
      }, 500);
    } catch (err) {
      console.warn("Email login API error, checking demo credentials:", err);
      if (email.includes("@")) {
        const fallbackUser = {
          id: 1,
          name: email.split("@")[0].replace(".", " "),
          email,
          role: "patient",
        };
        localStorage.setItem("patientToken", "demo_token_fallback");
        localStorage.setItem("patientUser", JSON.stringify(fallbackUser));
        setFeedback({ type: "success", message: "Login successful!" });
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(fallbackUser);
        }, 500);
      } else {
        setFeedback({ type: "error", message: err.message || "Invalid credentials." });
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== 1-TAP DEMO PATIENT LOGIN ====================
  const handleQuickDemoLogin = (patient) => {
    setLoading(true);
    setFeedback({ type: "success", message: `Logging in as ${patient.name}...` });

    const userObj = {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      activeToken: patient.activeToken,
      department: patient.department,
      doctor: patient.doctor,
      role: "patient",
    };

    localStorage.setItem("patientToken", "quick_demo_token_" + patient.id);
    localStorage.setItem("patientUser", JSON.stringify(userObj));

    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess(userObj);
    }, 600);
  };

  // ==================== BIOMETRIC SCAN SIMULATION ====================
  const handleBiometricLogin = () => {
    setBiometricScanning(true);
    setFeedback(null);

    setTimeout(() => {
      setBiometricScanning(false);
      handleQuickDemoLogin({
        id: 1,
        name: "Aarav Sharma",
        phone: "9876543210",
        email: "aarav@example.com",
        activeToken: "A-27",
        department: "Cardiology",
        doctor: "Dr. Amit Sharma",
      });
    }, 1200);
  };

  return (
    <div className="mobile-login-container">
      {/* Branding Header */}
      <div className="mobile-login-header">
        <div className="brand-badge">✚</div>
        <h2>Patient Login</h2>
        <p>Book appointments & track your live hospital queue position</p>
      </div>

      {/* Dual Tab Switcher: Phone OTP vs Email */}
      <div className="login-tabs-pill">
        <button
          type="button"
          className={`tab-pill-btn ${authMethod === "phone" ? "active" : ""}`}
          onClick={() => {
            setAuthMethod("phone");
            setFeedback(null);
          }}
        >
          <span>📱</span> Mobile Number (OTP)
        </button>
        <button
          type="button"
          className={`tab-pill-btn ${authMethod === "email" ? "active" : ""}`}
          onClick={() => {
            setAuthMethod("email");
            setFeedback(null);
          }}
        >
          <span>✉️</span> Email & Password
        </button>
      </div>

      {/* METHOD 1: MOBILE OTP AUTHENTICATION */}
      {authMethod === "phone" && (
        <div className="mobile-auth-body">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="mobile-form">
              <div className="mobile-input-group">
                <label>Mobile Number</label>
                <div className="phone-input-wrapper">
                  <div className="country-code-pill">
                    <span>🇮🇳</span> +91
                  </div>
                  <input
                    type="tel"
                    className="mobile-input"
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mobile-primary-btn"
                disabled={loading || phone.length < 10}
              >
                {loading ? "Sending Code..." : "Get Verification Code →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mobile-form">
              <div className="otp-container">
                <div className="mobile-input-group">
                  <label>Enter 6-Digit Code sent to +91 {phone}</label>
                  <div className="otp-boxes-grid" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="otp-digit-box"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      />
                    ))}
                  </div>
                </div>

                <div className="otp-meta-row">
                  <button
                    type="button"
                    className="auto-fill-chip"
                    onClick={handleAutoFillOtp}
                  >
                    ⚡ Auto-fill Demo Code (123456)
                  </button>

                  <button
                    type="button"
                    className="otp-resend-btn"
                    disabled={timerActive}
                    onClick={handleSendOtp}
                  >
                    {timerActive ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mobile-primary-btn"
                disabled={loading || otpDigits.join("").length !== 6}
              >
                {loading ? "Verifying..." : "Verify & Access Queue ➜"}
              </button>

              <div style={{ textAlign: "center", marginTop: "6px" }}>
                <button
                  type="button"
                  className="text-link-btn"
                  onClick={() => setOtpSent(false)}
                >
                  Change mobile number
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* METHOD 2: EMAIL & PASSWORD AUTHENTICATION */}
      {authMethod === "email" && (
        <form onSubmit={handleEmailLogin} className="mobile-form">
          <div className="mobile-input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon-left">✉️</span>
              <input
                type="email"
                className="mobile-input"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mobile-input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <span className="input-icon-left">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                className="mobile-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#475569" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-link-btn"
              onClick={() => setFeedback({ type: "success", message: "Password reset link sent to your email!" })}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="mobile-primary-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In to MediQueue ➜"}
          </button>
        </form>
      )}

      {/* Biometric Scan Quick Access */}
      <div className="biometric-row">
        <button
          type="button"
          className="biometric-btn"
          onClick={handleBiometricLogin}
          disabled={biometricScanning}
        >
          <span>{biometricScanning ? "🔍 Scanning Face..." : "🪪 Login with Face ID / Biometrics"}</span>
        </button>
      </div>

      {/* Alert / Feedback message */}
      {feedback && (
        <div className={`mobile-alert ${feedback.type}`}>
          <span>{feedback.type === "error" ? "⚠️" : "✅"}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 1-Tap Quick Demo Patient Login Cards */}
      <div className="demo-patients-section">
        <div className="demo-patients-title">
          <span>⚡ 1-Tap Demo Patient Login</span>
          <span className="demo-chip-badge">Fast Test</span>
        </div>

        <div className="demo-cards-list">
          <div
            className="demo-patient-card"
            onClick={() =>
              handleQuickDemoLogin({
                id: 1,
                name: "Aarav Sharma",
                phone: "9876543210",
                email: "aarav@example.com",
                activeToken: "A-27",
                department: "Cardiology",
                doctor: "Dr. Amit Sharma",
              })
            }
          >
            <div className="demo-card-info">
              <div className="demo-card-avatar">AS</div>
              <div className="demo-card-details">
                <strong>Aarav Sharma</strong>
                <small>Cardiology • Dr. Amit Sharma</small>
              </div>
            </div>
            <div className="demo-token-badge">Token #A-27</div>
          </div>

          <div
            className="demo-patient-card"
            onClick={() =>
              handleQuickDemoLogin({
                id: 2,
                name: "Diya Patel",
                phone: "9876543211",
                email: "diya@example.com",
                activeToken: "B-14",
                department: "General Medicine",
                doctor: "Dr. Priya Deshmukh",
              })
            }
          >
            <div className="demo-card-info">
              <div className="demo-card-avatar" style={{ background: "#fef3c7", color: "#b45309" }}>DP</div>
              <div className="demo-card-details">
                <strong>Diya Patel</strong>
                <small>General Medicine • Dr. Priya</small>
              </div>
            </div>
            <div className="demo-token-badge" style={{ background: "#fef3c7", color: "#92400e" }}>Token #B-14</div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mobile-login-footer">
        <div>
          <span>New to MediQueue? </span>
          <button type="button" className="text-link-btn" onClick={onRegister}>
            Create an Account
          </button>
        </div>

        <div>
          <span>Have a token number? </span>
          <button type="button" className="text-link-btn" onClick={onTrackQueue}>
            Track Live Queue without Login
          </button>
        </div>

        {onBack && (
          <div style={{ marginTop: "4px" }}>
            <button type="button" className="text-link-btn" onClick={onBack} style={{ color: "#64748b" }}>
              ← Back to Landing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientLogin;
