const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const DB_FILE = path.join(__dirname, "../data/hospital_db.json");

// Default initial dataset modeled directly from sample-data.sql
const initialData = {
  departments: [
    { id: 1, name: "Cardiology", description: "Heart and cardiovascular diagnosis and treatment", icon: "❤️" },
    { id: 2, name: "General Medicine", description: "Comprehensive primary healthcare and outpatient consultations", icon: "🩺" },
    { id: 3, name: "Orthopedics", description: "Musculoskeletal, joint, bone, and trauma surgery", icon: "🦴" },
    { id: 4, name: "Pediatrics", description: "Comprehensive care and treatment for infants & children", icon: "👶" },
    { id: 5, name: "Neurology", description: "Disorders of the brain, spinal cord, and nervous system", icon: "🧠" },
  ],
  users: [
    {
      id: 1,
      name: "Aarav Sharma",
      email: "aarav@example.com",
      phone: "9876543210",
      password_hash: "$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b",
      role: "patient",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Diya Patel",
      email: "diya@example.com",
      phone: "9876543211",
      password_hash: "$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b",
      role: "patient",
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "9876543212",
      password_hash: "$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b",
      role: "patient",
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Sunita Verma",
      email: "sunita@example.com",
      phone: "9876543213",
      password_hash: "$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b",
      role: "patient",
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      name: "Dr. Amit Sharma",
      email: "amit.doctor@smartcare.com",
      phone: "9876543220",
      password_hash: "$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b",
      role: "doctor",
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      name: "Hospital Admin",
      email: "admin@smartcare.com",
      phone: "9876543230",
      password_hash: "$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b",
      role: "hospital_staff",
      created_at: new Date().toISOString(),
    },
  ],
  doctors: [
    { id: 1, user_id: 5, name: "Dr. Amit Sharma", department_id: 1, department: "Cardiology", specialization: "Senior Cardiologist", room: "101", status: "Available", experience_years: 14, rating: "4.9" },
    { id: 2, user_id: null, name: "Dr. Priya Deshmukh", department_id: 2, department: "General Medicine", specialization: "Chief General Physician", room: "102", status: "Available", experience_years: 11, rating: "4.8" },
    { id: 3, user_id: null, name: "Dr. Rajesh Patel", department_id: 3, department: "Orthopedics", specialization: "Orthopedic Surgeon", room: "201", status: "Available", experience_years: 9, rating: "4.7" },
    { id: 4, user_id: null, name: "Dr. Sneha Reddy", department_id: 4, department: "Pediatrics", specialization: "Consultant Pediatrician", room: "205", status: "Busy", experience_years: 8, rating: "4.9" },
    { id: 5, user_id: null, name: "Dr. Vikram Malhotra", department_id: 5, department: "Neurology", specialization: "Senior Neurologist", room: "302", status: "Available", experience_years: 16, rating: "4.9" },
  ],
  patients: [
    { id: 1, user_id: 1, name: "Aarav Sharma", email: "aarav@example.com", phone: "9876543210", date_of_birth: "1996-05-14", gender: "Male", blood_group: "O+", address: "Flat 402, Skyline Towers, Mumbai", created_at: new Date().toISOString() },
    { id: 2, user_id: 2, name: "Diya Patel", email: "diya@example.com", phone: "9876543211", date_of_birth: "1998-09-22", gender: "Female", blood_group: "A+", address: "Plot 12, Sunrise Residency, Pune", created_at: new Date().toISOString() },
    { id: 3, user_id: 3, name: "Rajesh Kumar", email: "rajesh@example.com", phone: "9876543212", date_of_birth: "1984-11-03", gender: "Male", blood_group: "B+", address: "House 88, Green Park, Bangalore", created_at: new Date().toISOString() },
    { id: 4, user_id: 4, name: "Sunita Verma", email: "sunita@example.com", phone: "9876543213", date_of_birth: "1991-03-30", gender: "Female", blood_group: "AB+", address: "Tower B, Galaxy Apts, Delhi", created_at: new Date().toISOString() },
  ],
  appointments: [
    { id: 1, patient_id: 4, doctor_id: 1, department_id: 1, appointment_date: new Date().toISOString().split("T")[0], appointment_time: "09:45:00", token_number: "CARD-101", priority: "emergency", status: "confirmed", created_at: new Date().toISOString() },
    { id: 2, patient_id: 1, doctor_id: 1, department_id: 1, appointment_date: new Date().toISOString().split("T")[0], appointment_time: "10:00:00", token_number: "CARD-102", priority: "normal", status: "waiting", created_at: new Date().toISOString() },
    { id: 3, patient_id: 2, doctor_id: 2, department_id: 2, appointment_date: new Date().toISOString().split("T")[0], appointment_time: "10:15:00", token_number: "GEN-103", priority: "normal", status: "waiting", created_at: new Date().toISOString() },
    { id: 4, patient_id: 3, doctor_id: 3, department_id: 3, appointment_date: new Date().toISOString().split("T")[0], appointment_time: "10:30:00", token_number: "ORTHO-104", priority: "priority", status: "waiting", created_at: new Date().toISOString() },
  ],
  queue: [
    { id: 1, appointment_id: 1, token_number: "CARD-101", priority: "emergency", status: "in_consultation", patients_ahead: 0, estimated_wait_time: 0, called_at: new Date(Date.now() - 5 * 60000).toISOString(), completed_at: null, created_at: new Date().toISOString() },
    { id: 2, appointment_id: 2, token_number: "CARD-102", priority: "normal", status: "waiting", patients_ahead: 1, estimated_wait_time: 15, called_at: null, completed_at: null, created_at: new Date().toISOString() },
    { id: 3, appointment_id: 3, token_number: "GEN-103", priority: "normal", status: "waiting", patients_ahead: 2, estimated_wait_time: 30, called_at: null, completed_at: null, created_at: new Date().toISOString() },
    { id: 4, appointment_id: 4, token_number: "ORTHO-104", priority: "priority", status: "waiting", patients_ahead: 1, estimated_wait_time: 15, called_at: null, completed_at: null, created_at: new Date().toISOString() },
  ],
  resources: [
    { id: 1, resource_type: "General Beds", total: 50, occupied: 32, available: 18 },
    { id: 2, resource_type: "ICU Beds", total: 10, occupied: 7, available: 3 },
    { id: 3, resource_type: "Emergency Rooms", total: 5, occupied: 3, available: 2 },
    { id: 4, resource_type: "Ventilators", total: 8, occupied: 5, available: 3 },
  ],
  emergencies: [
    {
      id: "emg-1",
      patientName: "Trauma Case #102",
      department: "Emergency Trauma",
      ambulanceEta: 6,
      icuRequired: true,
      bedRequired: true,
      condition: "Severe head injury & multiple fractures",
      priority: "emergency",
      status: "incoming",
      createdAt: new Date().toISOString(),
    },
  ],
};

// Load or initialize persistent storage file
let dbData = { ...initialData };
function loadDbFromFile() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      dbData = JSON.parse(raw);
    } else {
      saveDbToFile();
    }
  } catch (err) {
    console.warn("Could not load from DB_FILE, using memory defaults:", err.message);
  }
}

function saveDbToFile() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to DB_FILE:", err.message);
  }
}

loadDbFromFile();

// PostgreSQL Pool (tries to connect if PostgreSQL is running locally)
const pgConfig = {
  user: process.env.PG_USER || "krushnalpatil",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "mediqueue",
  password: process.env.PG_PASSWORD || "",
  port: parseInt(process.env.PG_PORT || "5432", 10),
  connectionTimeoutMillis: 1500,
};

const pgPool = new Pool(pgConfig);
let isPostgresAvailable = false;

pgPool.query("SELECT 1")
  .then(() => {
    isPostgresAvailable = true;
    console.log("✅ PostgreSQL Connected: Live database active.");
  })
  .catch(() => {
    isPostgresAvailable = false;
    console.log("⚡ MediQueue Persistent Disk-Engine Active (Database persisted at server/data/hospital_db.json).");
  });

// Hybrid Database Interface
const db = {
  get isPostgres() {
    return isPostgresAvailable;
  },
  get store() {
    return dbData;
  },
  save() {
    saveDbToFile();
  },
  async query(text, params = []) {
    if (isPostgresAvailable) {
      try {
        return await pgPool.query(text, params);
      } catch (err) {
        console.warn("Postgres error, failing over to disk engine:", err.message);
      }
    }
    return executeQuery(text, params);
  },
  async connect() {
    if (isPostgresAvailable) {
      try {
        return await pgPool.connect();
      } catch (err) {
        // Fallback
      }
    }
    return {
      query: (t, p) => executeQuery(t, p),
      release: () => {},
    };
  },
};

function executeQuery(text, params = []) {
  const sql = text.trim();
  const lower = sql.toLowerCase();

  // 1. SELECT from users WHERE email = $1
  if (lower.includes("from users") && lower.includes("where email =")) {
    const email = (params[0] || "").toLowerCase().trim();
    const rows = dbData.users.filter((u) => u.email.toLowerCase() === email);
    return { rows, rowCount: rows.length };
  }

  // 2. INSERT into users
  if (lower.startsWith("insert into users")) {
    const id = dbData.users.length + 1;
    const name = params[0];
    const email = (params[1] || "").toLowerCase().trim();
    const password_hash = params[2];
    const role = params[3] || "patient";
    const phone = params[4] || null;
    const newUser = { id, name, email, phone, password_hash, role, created_at: new Date().toISOString() };
    dbData.users.push(newUser);
    saveDbToFile();
    return { rows: [newUser], rowCount: 1 };
  }

  // 3. INSERT into patients
  if (lower.startsWith("insert into patients")) {
    const id = dbData.patients.length + 1;
    const user_id = params[0] || null;
    const name = params[1] || "";
    const email = params[2] || null;
    const phone = params[3] || null;
    const date_of_birth = params[4] || null;
    const gender = params[5] || null;
    const address = params[6] || null;
    const newPatient = { id, user_id, name, email, phone, date_of_birth, gender, address, created_at: new Date().toISOString() };
    dbData.patients.push(newPatient);
    saveDbToFile();
    return { rows: [newPatient], rowCount: 1 };
  }

  // 4. SELECT doctors
  if (lower.includes("from doctors")) {
    if (lower.includes("where d.id =") || lower.includes("where id =")) {
      const docId = Number(params[0]);
      const doc = dbData.doctors.find((d) => d.id === docId);
      return { rows: doc ? [doc] : [], rowCount: doc ? 1 : 0 };
    }
    return { rows: dbData.doctors, rowCount: dbData.doctors.length };
  }

  // 5. UPDATE doctors status
  if (lower.startsWith("update doctors") && lower.includes("status =")) {
    const status = params[0];
    const docId = Number(params[1]);
    const doc = dbData.doctors.find((d) => d.id === docId);
    if (doc) {
      doc.status = status;
      saveDbToFile();
      return { rows: [doc], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 6. SELECT departments
  if (lower.includes("from departments")) {
    return { rows: dbData.departments, rowCount: dbData.departments.length };
  }

  // 7. SELECT patients
  if (lower.includes("from patients")) {
    return { rows: dbData.patients, rowCount: dbData.patients.length };
  }

  // 8. SELECT appointments
  if (lower.includes("from appointments a")) {
    const appts = dbData.appointments.map((a) => {
      const p = dbData.patients.find((pat) => pat.id === a.patient_id) || {};
      const doc = dbData.doctors.find((d) => d.id === a.doctor_id) || {};
      const dept = dbData.departments.find((d) => d.id === a.department_id) || {};
      const q = dbData.queue.find((item) => item.appointment_id === a.id) || {};
      return {
        ...a,
        patient_name: p.name || "Patient",
        patient_email: p.email,
        patient_phone: p.phone,
        department: dept.name,
        doctor_name: doc.name,
        doctor_room: doc.room,
        queue_id: q.id,
        queue_status: q.status || a.status,
        patients_ahead: q.patients_ahead || 0,
        estimated_wait_time: q.estimated_wait_time || 0,
        called_at: q.called_at,
        completed_at: q.completed_at,
      };
    });
    return { rows: appts, rowCount: appts.length };
  }

  // 9. SELECT queue
  if (lower.includes("from queue q")) {
    const queueItems = dbData.queue.map((q) => {
      const a = dbData.appointments.find((apt) => apt.id === q.appointment_id) || {};
      const p = dbData.patients.find((pat) => pat.id === a.patient_id) || {};
      const doc = dbData.doctors.find((d) => d.id === a.doctor_id) || {};
      const dept = dbData.departments.find((d) => d.id === a.department_id) || {};
      return {
        id: q.id,
        appointment_id: q.appointment_id,
        token_number: q.token_number,
        priority: q.priority,
        status: q.status,
        patients_ahead: q.patients_ahead,
        estimated_wait_time: q.estimated_wait_time,
        called_at: q.called_at,
        completed_at: q.completed_at,
        appointment_date: a.appointment_date,
        appointment_time: a.appointment_time,
        patient_id: p.id,
        patient_name: p.name || "Patient",
        patient_email: p.email,
        patient_phone: p.phone,
        department_id: dept.id,
        department: dept.name,
        doctor_id: doc.id,
        doctor_name: doc.name,
        room: doc.room,
      };
    });
    return { rows: queueItems, rowCount: queueItems.length };
  }

  // 10. Dashboard Summary
  if (lower.includes("count(*)::integer as total_patients")) {
    const total_patients = dbData.queue.length;
    const waiting_patients = dbData.queue.filter((q) => q.status === "waiting").length;
    const emergency_patients = dbData.queue.filter((q) => q.status === "waiting" && q.priority === "emergency").length;
    const completed_patients = dbData.queue.filter((q) => q.status === "completed").length;
    const waitTimes = dbData.queue.filter((q) => q.status === "waiting").map((q) => q.estimated_wait_time);
    const average_waiting_time = waitTimes.length > 0 ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) : 0;
    return {
      rows: [{
        total_patients,
        waiting_patients,
        emergency_patients,
        completed_patients,
        average_waiting_time,
      }],
      rowCount: 1,
    };
  }

  return { rows: [], rowCount: 0 };
}

module.exports = db;
