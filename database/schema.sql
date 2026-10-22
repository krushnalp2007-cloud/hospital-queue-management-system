-- ============================================
-- MediQueue Database Schema (PostgreSQL)
-- ============================================

-- Drop existing tables if needed
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS emergencies CASCADE;
DROP TABLE IF EXISTS beds CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS queue CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'patient',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CHECK (role IN ('patient', 'doctor', 'hospital_staff', 'admin'))
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'stethoscope'
);

-- 3. PATIENTS TABLE
CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    address TEXT,
    emergency_contact VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. DOCTORS TABLE
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    specialization VARCHAR(100),
    room VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Available',
    experience_years INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CHECK (status IN ('Available', 'Busy', 'On Break', 'Unavailable'))
);

-- 5. APPOINTMENTS TABLE
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    token_number VARCHAR(20),
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'waiting',
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CHECK (priority IN ('normal', 'priority', 'emergency')),
    CHECK (status IN ('confirmed', 'waiting', 'completed', 'cancelled'))
);

-- 6. QUEUE TABLE
CREATE TABLE queue (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    token_number VARCHAR(20) NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(30) DEFAULT 'waiting',
    patients_ahead INTEGER DEFAULT 0,
    estimated_wait_time INTEGER DEFAULT 0,
    called_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CHECK (priority IN ('normal', 'priority', 'emergency')),
    CHECK (
        status IN (
            'waiting',
            'called',
            'in_consultation',
            'completed',
            'cancelled'
        )
    )
);

-- 7. BEDS TABLE
CREATE TABLE beds (
    id SERIAL PRIMARY KEY,
    bed_number VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    room VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Available',
    patient_id BIGINT REFERENCES patients(id) ON DELETE SET NULL,

    CHECK (status IN ('Available', 'Occupied', 'Maintenance'))
);

-- 8. EMERGENCIES TABLE
CREATE TABLE emergencies (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    condition TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'emergency',
    status VARCHAR(30) DEFAULT 'incoming',
    bed_id INTEGER REFERENCES beds(id) ON DELETE SET NULL,
    arrival_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CHECK (priority = 'emergency'),
    CHECK (
        status IN (
            'incoming',
            'arrived',
            'admitted',
            'completed'
        )
    )
);

-- 9. RESOURCES TABLE
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    resource_type VARCHAR(100) UNIQUE NOT NULL,
    total INTEGER NOT NULL DEFAULT 0,
    occupied INTEGER NOT NULL DEFAULT 0,
    available INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CHECK (total >= 0),
    CHECK (occupied >= 0),
    CHECK (available >= 0)
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_doctors_department ON doctors(department_id);
CREATE INDEX idx_doctors_status ON doctors(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_queue_status ON queue(status);
CREATE INDEX idx_emergencies_status ON emergencies(status);
