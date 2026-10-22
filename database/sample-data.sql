-- ============================================
-- MediQueue Sample Data (PostgreSQL)
-- ============================================

-- 1. DEPARTMENTS
INSERT INTO departments (id, name, description, icon) VALUES
(1, 'Cardiology', 'Heart and cardiovascular diagnosis and treatment', 'heart-pulse'),
(2, 'General Medicine', 'Comprehensive primary health care and outpatient care', 'stethoscope'),
(3, 'Orthopedics', 'Musculoskeletal, joint, bone, and trauma surgery', 'bone'),
(4, 'Pediatrics', 'Comprehensive care and treatment for infants & children', 'baby'),
(5, 'Neurology', 'Disorders of the brain, spinal cord, and nervous system', 'brain')
ON CONFLICT (id) DO NOTHING;

-- 2. USERS (bcrypt hashes for password 'password123')
INSERT INTO users (id, name, email, phone, password_hash, role) VALUES
(1, 'Aarav Sharma', 'aarav@example.com', '9876543210', '$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b', 'patient'),
(2, 'Diya Patel', 'diya@example.com', '9876543211', '$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b', 'patient'),
(3, 'Rajesh Kumar', 'rajesh@example.com', '9876543212', '$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b', 'patient'),
(4, 'Sunita Verma', 'sunita@example.com', '9876543213', '$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b', 'patient'),
(5, 'Dr. Amit Sharma', 'amit.doctor@smartcare.com', '9876543220', '$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b', 'doctor'),
(6, 'Dr. Priya Deshmukh', 'priya.doctor@smartcare.com', '9876543221', '$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b', 'doctor'),
(7, 'Dr. Rajesh Patel', 'rajesh.doctor@smartcare.com', '9876543222', '$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b', 'doctor'),
(8, 'Dr. Sneha Reddy', 'sneha.doctor@smartcare.com', '9876543223', '$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b', 'doctor'),
(9, 'Hospital Admin', 'admin@smartcare.com', '9876543230', '$2a$10$w8T9H6V2n4R0v0U2O4X8UeP3S2b6g6r8q9s0t1u2v3w4x5y6z7a8b', 'hospital_staff')
ON CONFLICT (id) DO NOTHING;

-- 3. DOCTORS
INSERT INTO doctors (id, user_id, name, department_id, specialization, room, status, experience_years) VALUES
(1, 5, 'Dr. Amit Sharma', 1, 'Senior Cardiologist', '101', 'Available', 14),
(2, 6, 'Dr. Priya Deshmukh', 2, 'Chief General Physician', '102', 'Available', 11),
(3, 7, 'Dr. Rajesh Patel', 3, 'Orthopedic Surgeon', '201', 'Available', 9),
(4, 8, 'Dr. Sneha Reddy', 4, 'Consultant Pediatrician', '205', 'Busy', 8),
(5, NULL, 'Dr. Vikram Malhotra', 5, 'Neurologist', '302', 'Available', 16)
ON CONFLICT (id) DO NOTHING;

-- 4. PATIENTS
INSERT INTO patients (id, user_id, name, email, phone, date_of_birth, gender, blood_group, address) VALUES
(1, 1, 'Aarav Sharma', 'aarav@example.com', '9876543210', '1996-05-14', 'Male', 'O+', 'Flat 402, Skyline Towers, Mumbai'),
(2, 2, 'Diya Patel', 'diya@example.com', '9876543211', '1998-09-22', 'Female', 'A+', 'Plot 12, Sunrise Residency, Pune'),
(3, 3, 'Rajesh Kumar', 'rajesh@example.com', '9876543212', '1984-11-03', 'Male', 'B+', 'House 88, Green Park, Bangalore'),
(4, 4, 'Sunita Verma', 'sunita@example.com', '9876543213', '1991-03-30', 'Female', 'AB+', 'Tower B, Galaxy Apts, Delhi'),
(5, NULL, 'Kunal Mehta', 'kunal@example.com', '9876543214', '2001-07-19', 'Male', 'O-', 'Sector 15, Navi Mumbai')
ON CONFLICT (id) DO NOTHING;

-- 5. APPOINTMENTS
INSERT INTO appointments (id, patient_id, doctor_id, department_id, appointment_date, appointment_time, token_number, priority, status) VALUES
(1, 1, 1, 1, CURRENT_DATE, '10:00:00', 'A-27', 'normal', 'waiting'),
(2, 2, 2, 2, CURRENT_DATE, '10:15:00', 'B-14', 'normal', 'waiting'),
(3, 3, 3, 3, CURRENT_DATE, '10:30:00', 'C-08', 'priority', 'waiting'),
(4, 4, 1, 1, CURRENT_DATE, '09:45:00', 'A-26', 'emergency', 'confirmed'),
(5, 5, 2, 2, CURRENT_DATE, '09:30:00', 'B-12', 'normal', 'completed')
ON CONFLICT (id) DO NOTHING;

-- 6. QUEUE ENTRIES
INSERT INTO queue (id, appointment_id, token_number, priority, status, patients_ahead, estimated_wait_time, called_at, completed_at) VALUES
(1, 4, 'A-26', 'emergency', 'in_consultation', 0, 0, CURRENT_TIMESTAMP - INTERVAL '5 minutes', NULL),
(2, 1, 'A-27', 'normal', 'waiting', 1, 15, NULL, NULL),
(3, 2, 'B-14', 'normal', 'waiting', 2, 30, NULL, NULL),
(4, 3, 'C-08', 'priority', 'waiting', 0, 10, NULL, NULL),
(5, 5, 'B-12', 'normal', 'completed', 0, 0, CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;

-- 7. BEDS
INSERT INTO beds (id, bed_number, type, room, status) VALUES
(1, 'BED-ICU-01', 'ICU', 'ICU-A', 'Occupied'),
(2, 'BED-ICU-02', 'ICU', 'ICU-A', 'Available'),
(3, 'BED-ICU-03', 'ICU', 'ICU-B', 'Available'),
(4, 'BED-GEN-101', 'General', 'Ward-1', 'Available'),
(5, 'BED-GEN-102', 'General', 'Ward-1', 'Occupied'),
(6, 'BED-GEN-103', 'General', 'Ward-2', 'Available'),
(7, 'BED-EMG-01', 'Emergency', 'ER-1', 'Available')
ON CONFLICT (id) DO NOTHING;

-- 8. RESOURCES
INSERT INTO resources (id, resource_type, total, occupied, available) VALUES
(1, 'General Beds', 50, 32, 18),
(2, 'ICU Beds', 10, 7, 3),
(3, 'Emergency Rooms', 5, 3, 2),
(4, 'Ventilators', 8, 5, 3)
ON CONFLICT (id) DO NOTHING;

-- Reset serial sequences
SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('doctors_id_seq', (SELECT MAX(id) FROM doctors));
SELECT setval('patients_id_seq', (SELECT MAX(id) FROM patients));
SELECT setval('appointments_id_seq', (SELECT MAX(id) FROM appointments));
SELECT setval('queue_id_seq', (SELECT MAX(id) FROM queue));
SELECT setval('beds_id_seq', (SELECT MAX(id) FROM beds));
SELECT setval('resources_id_seq', (SELECT MAX(id) FROM resources));
