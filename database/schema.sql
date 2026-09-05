CREATE DATABASE IF NOT EXISTS smartcare_queue;

USE smartcare_queue;



-- 1. USERS


CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('PATIENT', 'DOCTOR', 'STAFF', 'ADMIN') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);



-- 2. DEPARTMENTS


CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- 3. PATIENTS


CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    blood_group VARCHAR(5),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_patient_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);



-- 4. DOCTORS


CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    department_id INT NOT NULL,
    specialization VARCHAR(100),
    consultation_duration_minutes INT DEFAULT 15,
    is_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_doctor_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_doctor_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);



-- 5. DOCTOR SCHEDULE


CREATE TABLE doctor_schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    day_of_week ENUM(
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY'
    ) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_schedule_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(doctor_id)
        ON DELETE CASCADE
);



-- 6. APPOINTMENTS


CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME,
    reason VARCHAR(255),
    status ENUM(
        'BOOKED',
        'CHECKED_IN',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
        'NO_SHOW'
    ) DEFAULT 'BOOKED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id),

    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(doctor_id),

    CONSTRAINT fk_appointment_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);



-- 7. QUEUE ENTRIES / TOKENS


CREATE TABLE queue_entries (
    queue_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    patient_id INT NOT NULL,
    doctor_id INT,
    department_id INT NOT NULL,

    token_number INT NOT NULL,
    queue_date DATE NOT NULL,

    priority ENUM(
        'NORMAL',
        'URGENT',
        'EMERGENCY'
    ) DEFAULT 'NORMAL',

    queue_status ENUM(
        'WAITING',
        'CALLED',
        'IN_PROGRESS',
        'COMPLETED',
        'SKIPPED',
        'CANCELLED'
    ) DEFAULT 'WAITING',

    queue_position INT,

    estimated_wait_minutes INT DEFAULT 0,
    actual_wait_minutes INT,

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,

    CONSTRAINT fk_queue_appointment
        FOREIGN KEY (appointment_id)
        REFERENCES appointments(appointment_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_queue_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id),

    CONSTRAINT fk_queue_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(doctor_id),

    CONSTRAINT fk_queue_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);



-- 8. NOTIFICATIONS


CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    notification_type ENUM(
        'APPOINTMENT',
        'QUEUE',
        'EMERGENCY',
        'SYSTEM'
    ) NOT NULL,

    title VARCHAR(150) NOT NULL,
    message VARCHAR(500) NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);



-- 9. HOSPITAL RESOURCES


CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,

    resource_type ENUM(
        'BED',
        'ICU'
    ) NOT NULL,

    total_count INT NOT NULL DEFAULT 0,
    available_count INT NOT NULL DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_resource_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE CASCADE
);



-- 10. EMERGENCY ALERTS


CREATE TABLE emergency_alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT,
    department_id INT,

    alert_type ENUM(
        'EMERGENCY_PATIENT',
        'AMBULANCE_ARRIVAL'
    ) NOT NULL,

    description VARCHAR(500),

    priority ENUM(
        'HIGH',
        'CRITICAL'
    ) DEFAULT 'HIGH',

    status ENUM(
        'ACTIVE',
        'RESOLVED',
        'CANCELLED'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,

    CONSTRAINT fk_emergency_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_emergency_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE SET NULL
);



-- INDEXES FOR FASTER QUEUE OPERATIONS


CREATE INDEX idx_queue_department_date
ON queue_entries(department_id, queue_date);

CREATE INDEX idx_queue_status
ON queue_entries(queue_status);

CREATE INDEX idx_queue_priority
ON queue_entries(priority);

CREATE INDEX idx_appointment_date
ON appointments(appointment_date);

CREATE INDEX idx_appointment_patient
ON appointments(patient_id);

CREATE INDEX idx_appointment_doctor
ON appointments(doctor_id);

CREATE INDEX idx_notifications_user
ON notifications(user_id);