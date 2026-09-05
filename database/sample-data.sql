USE smartcare_queue;


-- SMARTCARE QUEUE SAMPLE DATA

-- 1. DEPARTMENTS


INSERT INTO departments
(department_name, description)
VALUES
('General Medicine',
 'General medical consultation and treatment'),

('Cardiology',
 'Heart and cardiovascular care'),

('Orthopedics',
 'Bone, joint and musculoskeletal treatment'),

('Pediatrics',
 'Medical care for children');



-- 2. USERS


INSERT INTO users
(full_name, email, password_hash, phone, role)
VALUES
('Aarav Patient',
 'aarav@example.com',
 'demo_hash_1',
 '9876543210',
 'PATIENT'),

('Diya Patient',
 'diya@example.com',
 'demo_hash_2',
 '9876543211',
 'PATIENT'),

('Dr. Rahul Sharma',
 'rahul.doctor@example.com',
 'demo_hash_3',
 '9876543220',
 'DOCTOR'),

('Dr. Priya Patil',
 'priya.doctor@example.com',
 'demo_hash_4',
 '9876543221',
 'DOCTOR'),

('Hospital Admin',
 'admin@smartcare.com',
 'demo_hash_5',
 '9876543230',
 'ADMIN');



-- 3. PATIENTS


INSERT INTO patients
(user_id, date_of_birth, gender, blood_group,
 emergency_contact_name, emergency_contact_phone)
VALUES
(1, '2005-04-15', 'MALE', 'O+',
 'Rajesh Patient', '9876500010'),

(2, '2006-08-21', 'FEMALE', 'A+',
 'Sunita Patient', '9876500011');



-- 4. DOCTORS


INSERT INTO doctors
(user_id, department_id, specialization,
 consultation_duration_minutes, is_available)
VALUES
(3, 1, 'General Physician', 15, TRUE),

(4, 2, 'Cardiologist', 20, TRUE);



-- 5. DOCTOR SCHEDULE


INSERT INTO doctor_schedule
(doctor_id, day_of_week, start_time, end_time, is_available)
VALUES
(1, 'MONDAY', '09:00:00', '13:00:00', TRUE),

(1, 'WEDNESDAY', '09:00:00', '13:00:00', TRUE),

(2, 'TUESDAY', '10:00:00', '14:00:00', TRUE),

(2, 'THURSDAY', '10:00:00', '14:00:00', TRUE);



-- 6. APPOINTMENTS


INSERT INTO appointments
(patient_id, doctor_id, department_id,
 appointment_date, appointment_time,
 reason, status)
VALUES
(1, 1, 1,
 '2026-09-07', '10:00:00',
 'Regular medical consultation',
 'BOOKED'),

(2, 2, 2,
 '2026-09-08', '11:00:00',
 'Heart check-up',
 'BOOKED');



-- 7. QUEUE ENTRIES / TOKENS


INSERT INTO queue_entries
(appointment_id, patient_id, doctor_id, department_id,
 token_number, queue_date, priority,
 queue_status, queue_position,
 estimated_wait_minutes)
VALUES
(1, 1, 1, 1,
 101, '2026-09-07', 'NORMAL',
 'WAITING', 1, 15),

(2, 2, 2, 2,
 201, '2026-09-08', 'NORMAL',
 'WAITING', 1, 20);



-- 8. HOSPITAL RESOURCES


INSERT INTO resources
(department_id, resource_type,
 total_count, available_count)
VALUES
(1, 'BED', 50, 18),

(1, 'ICU', 10, 3),

(2, 'BED', 30, 12),

(2, 'ICU', 8, 2);



-- 9. NOTIFICATIONS


INSERT INTO notifications
(user_id, notification_type,
 title, message, is_read)
VALUES
(1, 'APPOINTMENT',
 'Appointment Booked',
 'Your hospital appointment has been booked successfully.',
 FALSE),

(2, 'QUEUE',
 'Queue Update',
 'Your current estimated waiting time is 20 minutes.',
 FALSE),

(1, 'SYSTEM',
 'Welcome to SmartCare Queue',
 'Your SmartCare Queue account is ready.',
 FALSE);



-- 10. EMERGENCY ALERT


INSERT INTO emergency_alerts
(patient_id, department_id,
 alert_type, description,
 priority, status)
VALUES
(1, 1,
 'EMERGENCY_PATIENT',
 'Patient requires urgent medical attention.',
 'HIGH',
 'ACTIVE');