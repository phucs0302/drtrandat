const db = require('../config/db');

// Lấy danh sách bác sĩ (public)
const getAllDoctors = async (req, res) => {
  const [rows] = await db.query(`
    SELECT d.id, u.name, u.email, u.phone,
           d.specialty, d.degree, d.experience, d.bio, d.avatar
    FROM doctors d
    JOIN users u ON u.id = d.user_id
    WHERE u.is_active = 1
    ORDER BY u.name
  `);
  res.json(rows);
};

// Lấy chi tiết một bác sĩ (public)
const getDoctorById = async (req, res) => {
  const [rows] = await db.query(`
    SELECT d.id, u.name, u.email, u.phone,
           d.specialty, d.degree, d.experience, d.bio, d.avatar
    FROM doctors d
    JOIN users u ON u.id = d.user_id
    WHERE d.id = ? AND u.is_active = 1
  `, [req.params.id]);

  if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
  res.json(rows[0]);
};

// Lấy lịch làm việc của bác sĩ (để bệnh nhân chọn khi đặt lịch)
const getDoctorSchedules = async (req, res) => {
  const [rows] = await db.query(`
    SELECT s.id, s.work_date, s.start_time, s.end_time, s.slot_duration, s.max_slots,
           (s.max_slots - COUNT(a.id)) AS available_slots
    FROM doctor_schedules s
    LEFT JOIN appointments a ON a.schedule_id = s.id AND a.status != 'cancelled'
    WHERE s.doctor_id = ? AND s.work_date >= CURDATE() AND s.is_active = 1
    GROUP BY s.id
    HAVING available_slots > 0
    ORDER BY s.work_date, s.start_time
  `, [req.params.id]);
  res.json(rows);
};

// [Doctor] Lấy lịch làm việc của chính mình
const getMySchedules = async (req, res) => {
  const [doctor] = await db.query('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
  if (!doctor.length) return res.status(404).json({ message: 'Không tìm thấy hồ sơ bác sĩ' });

  const [rows] = await db.query(`
    SELECT s.*, COUNT(a.id) AS booked_slots
    FROM doctor_schedules s
    LEFT JOIN appointments a ON a.schedule_id = s.id AND a.status != 'cancelled'
    WHERE s.doctor_id = ?
    GROUP BY s.id
    ORDER BY s.work_date DESC, s.start_time
  `, [doctor[0].id]);
  res.json(rows);
};

// [Doctor] Tạo lịch làm việc
const createSchedule = async (req, res) => {
  const [doctor] = await db.query('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
  if (!doctor.length) return res.status(404).json({ message: 'Không tìm thấy hồ sơ bác sĩ' });

  const { work_date, start_time, end_time, slot_duration, max_slots } = req.body;
  if (!work_date || !start_time || !end_time)
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin lịch làm việc' });

  try {
    const [result] = await db.query(
      'INSERT INTO doctor_schedules (doctor_id, work_date, start_time, end_time, slot_duration, max_slots) VALUES (?,?,?,?,?,?)',
      [doctor[0].id, work_date, start_time, end_time, slot_duration || 30, max_slots || 10]
    );
    res.status(201).json({ message: 'Tạo lịch làm việc thành công', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Đã có lịch làm việc trong khung giờ này' });
    throw err;
  }
};

// [Doctor] Cập nhật / xoá lịch làm việc
const updateSchedule = async (req, res) => {
  const [doctor] = await db.query('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
  if (!doctor.length) return res.status(404).json({ message: 'Không tìm thấy hồ sơ bác sĩ' });

  const { is_active } = req.body;
  await db.query(
    'UPDATE doctor_schedules SET is_active = ? WHERE id = ? AND doctor_id = ?',
    [is_active, req.params.id, doctor[0].id]
  );
  res.json({ message: 'Cập nhật lịch làm việc thành công' });
};

// [Doctor] Xem danh sách lịch khám của mình
const getMyAppointments = async (req, res) => {
  const [doctor] = await db.query('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
  if (!doctor.length) return res.status(404).json({ message: 'Không tìm thấy hồ sơ bác sĩ' });

  const [rows] = await db.query(`
    SELECT a.id, a.appt_date, a.appt_time, a.status, a.reason, a.notes,
           u.name AS patient_name, u.phone AS patient_phone, u.email AS patient_email
    FROM appointments a
    JOIN users u ON u.id = a.patient_id
    WHERE a.doctor_id = ?
    ORDER BY a.appt_date DESC, a.appt_time DESC
  `, [doctor[0].id]);
  res.json(rows);
};

module.exports = {
  getAllDoctors, getDoctorById, getDoctorSchedules,
  getMySchedules, createSchedule, updateSchedule,
  getMyAppointments,
};