-- ============================================================
-- HOSPITAL APPOINTMENT SYSTEM - DATABASE SCHEMA
-- ============================================================

CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

-- ------------------------------------------------------------
-- USERS (chung cho Admin, Doctor, Patient)
-- ------------------------------------------------------------
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  phone       VARCHAR(20),
  role        ENUM('admin','doctor','patient') NOT NULL DEFAULT 'patient',
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- DOCTORS (thông tin chi tiết bác sĩ)
-- ------------------------------------------------------------
CREATE TABLE doctors (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,
  specialty     VARCHAR(100) NOT NULL,
  degree        VARCHAR(100),
  experience    INT DEFAULT 0 COMMENT 'Số năm kinh nghiệm',
  bio           TEXT,
  avatar        VARCHAR(255),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- DOCTOR SCHEDULES (lịch làm việc của bác sĩ)
-- ------------------------------------------------------------
CREATE TABLE doctor_schedules (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id   INT NOT NULL,
  work_date   DATE NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  slot_duration INT NOT NULL DEFAULT 30 COMMENT 'Phút mỗi slot',
  max_slots   INT NOT NULL DEFAULT 10,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_doctor_date_time (doctor_id, work_date, start_time),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- APPOINTMENTS (lịch khám)
-- ------------------------------------------------------------
CREATE TABLE appointments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  patient_id    INT NOT NULL,
  doctor_id     INT NOT NULL,
  schedule_id   INT NOT NULL,
  appt_date     DATE NOT NULL,
  appt_time     TIME NOT NULL,
  reason        VARCHAR(255),
  status        ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  notes         TEXT,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_doctor_datetime (doctor_id, appt_date, appt_time),
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id)  REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (schedule_id) REFERENCES doctor_schedules(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- SEED DATA
-- ------------------------------------------------------------

-- Admin mặc định (password: Admin@123)
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin System', 'admin@hospital.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3i', '0900000000', 'admin');

-- Bác sĩ mẫu (password: Doctor@123)
INSERT INTO users (name, email, password, phone, role) VALUES
('BS. Nguyễn Văn An',  'bsnguyenan@hospital.com',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3i', '0911111111', 'doctor'),
('BS. Trần Thị Bình',  'bstranbich@hospital.com',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3i', '0922222222', 'doctor'),
('BS. Lê Minh Châu',   'bsleminchau@hospital.com',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3i', '0933333333', 'doctor');

INSERT INTO doctors (user_id, specialty, degree, experience, bio) VALUES
(2, 'Nội tổng quát',  'Tiến sĩ Y khoa',  10, 'Chuyên khoa nội tổng quát, nhiều năm kinh nghiệm.'),
(3, 'Tim mạch',       'Thạc sĩ Y khoa',   8, 'Chuyên gia tim mạch can thiệp.'),
(4, 'Da liễu',        'Bác sĩ chuyên khoa II', 12, 'Chuyên điều trị các bệnh về da.');

-- Bệnh nhân mẫu (password: Patient@123)
INSERT INTO users (name, email, password, phone, role) VALUES
('Phạm Quốc Dũng', 'dungpham@gmail.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3i', '0944444444', 'patient');

-- Lịch làm việc mẫu
INSERT INTO doctor_schedules (doctor_id, work_date, start_time, end_time, slot_duration, max_slots) VALUES
(1, CURDATE() + INTERVAL 1 DAY, '08:00:00', '12:00:00', 30, 8),
(1, CURDATE() + INTERVAL 2 DAY, '13:00:00', '17:00:00', 30, 8),
(2, CURDATE() + INTERVAL 1 DAY, '08:00:00', '11:30:00', 30, 7),
(3, CURDATE() + INTERVAL 3 DAY, '14:00:00', '17:00:00', 30, 6);