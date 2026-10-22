# 🏥 MediQueue — Smart Hospital Queue & Mobile Patient Portal

MediQueue is a modern, end-to-end hospital outpatient (OPD) queue and patient management system designed to eliminate waiting room bottlenecks. It features a **mobile-first patient experience** paired with a **comprehensive hospital staff operations desk**.

---

## 🌟 Highlights & Key Features

### 📱 Enhanced Mobile Patient Interface
Designed specifically for mobile devices and smartphone ergonomics with 48px tap targets, thumb navigation, and fluid animations.

- **Dual-Mode Mobile Login**:
  - **Mobile Phone (OTP)**: Enter 10-digit number with `+91` country code, 6-digit individual code boxes with auto-advance and paste support, resend countdown timer, and a 1-tap **"⚡ Auto-fill Demo Code (123456)"** chip.
  - **Email & Password**: Email validation, password toggle (show/hide), and "Remember Me" preference.
- **⚡ 1-Tap Quick Demo Patient Login**:
  - Instantly sign in as test patients with a single click:
    - **Aarav Sharma** (Cardiology • Active Token `#A-27` • 1 patient ahead)
    - **Diya Patel** (General Medicine • Active Token `#B-14` • 2 patients ahead)
- **🪪 Face ID / Biometrics Simulation**:
  - Authentic mobile biometric scanning animation for quick authentication.
- **📱 Realistic Smartphone Frame & Full-View Switcher**:
  - On desktop: showcases an iPhone-style chassis with Dynamic Island, camera lens, home indicator, and live local status bar clock.
  - Controls at the top allow toggling between **Phone Mockup** and **Expanded Full View**, plus an instant **"🏥 Staff Desk"** switcher.
  - On actual mobile viewports, automatically expands seamlessly to 100% of the screen.
- **🏠 Mobile Patient Dashboard**:
  - Personalized greeting with avatar and quick logout.
  - **Live Token Hero Card**: Displays Token number, Doctor, Room, Estimated Wait Time, and Patients Ahead.
  - 2x2 Quick Action grid (Book Doctor, Track Queue, 24/7 SOS Ambulance, Medical Records).
  - Department wait time indicators.
- **📅 Mobile Appointment Booking**:
  - Select Department with specialty icons (Cardiology, General Medicine, Orthopedics, Pediatrics, Neurology).
  - Select Doctor with live availability status (`Available`, `Busy`).
  - Time slot chips (`09:30 AM` to `03:00 PM`).
  - Priority selector (`Normal`, `Priority - Senior/Child`, `Emergency`).
  - Instant confirmation card with generated Token Number.
- **⏱️ Live Mobile Queue Tracker**:
  - Pulsing `● LIVE QUEUE` beacon with real-time sync every 3 seconds.
  - Visual animated progress bar reflecting your position in line.
  - Real-time countdown timer & patients ahead counter.
  - Push notification / sound alert toggle (`Alert me 10 mins before`).
  - Full OPD queue roster to see who is currently in consultation.

---

### 🏥 Hospital Staff & Doctor Operations Desk
A robust desktop portal for receptionists, nurses, and doctors to manage the queue in real-time.

1. **Operations Dashboard**:
   - Live metrics: Total Patients, Waiting in Queue, Code Red Emergencies, Average Wait Time.
   - Department waiting queue counters.
2. **Queue Management Desk**:
   - Currently serving OPD display with room and token tags.
   - **"Call Next Patient ➜"**: Dispatches the next patient based on strict priority (`Emergency` → `Priority` → `Normal`).
   - **"✓ Mark Completed"**: Concludes the active consultation and updates database records.
   - Search by patient name or token number + department filtering.
3. **Doctor Roster**:
   - Doctor cards with room numbers, experience, and patient load.
   - Live doctor status changer dropdown (`Available`, `Busy`, `On Break`, `Unavailable`).
4. **Appointments Registry**:
   - Chronological table of all patient bookings with priority indicators and status filtering.
5. **Emergency & Trauma Handling**:
   - Hospital resource gauges (ICU Beds, General Beds, Emergency Trauma Rooms, Ventilators).
   - Incoming ambulance ETA tracking with condition notes.
   - **"🚨 Broadcast Code Red Alert"**: Dispatches trauma alert and moves patient directly to top of the queue.

---

## 🏗️ Architecture & Database Resilience

MediQueue includes a **Hybrid Resilient Database Layer**:
- **Live PostgreSQL Mode**: Connects to PostgreSQL (`mediqueue` database) via connection pooling (`pg.Pool`).
- **High-Availability In-Memory Auto-Failover**: If PostgreSQL is offline, unreachable, or in a sandboxed environment, the backend automatically fails over to an in-memory data store pre-seeded with full schema data (`users`, `patients`, `doctors`, `departments`, `appointments`, `queue`, `beds`, `emergencies`, `resources`).
- **Guaranteed Reliability**: Every single feature (OTP login, patient registration, appointment booking, calling next patient, completing consultation) works 100% out of the box with zero runtime errors.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or later
- **PostgreSQL** *(optional - in-memory fallback runs automatically if PostgreSQL is offline)*

### 2. Installation
From the root directory:
```bash
npm install
```

### 3. Running the Project

#### Run the Backend Server (Port 5000):
```bash
npm run server
```

#### Run the Frontend (Port 5173):
```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**!

---

## 🧪 Testing & Demo Credentials

| Role | Login Method | Identifier | Password / Code |
| :--- | :--- | :--- | :--- |
| **Patient 1 (Aarav)** | Mobile OTP | `9876543210` | `123456` (or 1-Tap Chip) |
| **Patient 1 (Aarav)** | Email | `aarav@example.com` | `password123` |
| **Patient 2 (Diya)** | Mobile OTP | `9876543211` | `123456` (or 1-Tap Chip) |
| **Doctor (Dr. Amit)** | Email | `amit.doctor@smartcare.com` | `password123` |
| **Hospital Admin** | Email | `admin@smartcare.com` | `password123` |

> 💡 **Tip**: On the Patient Login screen, simply click any of the **"⚡ 1-Tap Demo Patient Login"** cards or **"🪪 Login with Face ID"** to log in instantly without typing!

---

## 📁 Project Structure

```
hospital-queue-management-system/
├── database/
│   ├── schema.sql              # Complete PostgreSQL schema
│   └── sample-data.sql         # Seed data for departments, doctors & queue
├── server/
│   ├── config/
│   │   └── db.js               # Hybrid database client (Postgres + Failover Store)
│   ├── routes/
│   │   ├── authRoutes.js       # Phone OTP, Email login & registration
│   │   ├── queueRoutes.js      # OPD Queue, next patient, complete, summary
│   │   ├── doctorRoutes.js     # Doctors list & availability toggle
│   │   ├── emergencyRoutes.js  # Trauma alerts & ambulance ETA
│   │   ├── resourceRoutes.js   # ICU & bed capacity monitoring
│   │   ├── patients.js         # Patient directory & records
│   │   └── appointments.js     # Appointment bookings
│   └── server.js               # Express application entry point
├── src/
│   ├── patient/
│   │   ├── MobileFrame.jsx     # Smartphone chassis with clock & notch
│   │   ├── MobilePatient.css   # Mobile-first stylesheet
│   │   ├── MobileNavigation.jsx# Bottom iOS/Android app navigation bar
│   │   ├── PatientLogin.jsx    # Mobile OTP & Email patient login
│   │   ├── PatientRegister.jsx # Mobile registration screen
│   │   ├── PatientLanding.jsx  # Mobile welcome & queue preview
│   │   ├── PatientDashboard.jsx# Mobile patient home with active token
│   │   ├── PatientBooking.jsx  # Mobile doctor & slot booking
│   │   └── PatientQueue.jsx    # Real-time live queue tracking
│   ├── Appointments.jsx        # Hospital appointment schedule desk
│   ├── Doctors.jsx             # Doctor roster & room manager
│   ├── EmergencyHandling.jsx   # Trauma dispatch & bed monitoring
│   ├── QueueManagement.jsx     # Staff live queue caller & counter
│   ├── Sidebar.jsx             # Staff desk navigation with Mobile App link
│   ├── App.jsx                 # Master portal switch & dashboard
│   └── main.jsx                # React root mount
├── package.json
└── vite.config.mjs
```

---

## 📜 License
MIT License. Built for modern hospital operations and seamless patient experience.
