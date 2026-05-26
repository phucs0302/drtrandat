const bcrypt = require('bcrypt');
const db     = require('../config/db');

// Lấy danh sách tất cả người dùng
const getAllUsers = async (req, res) => {
  const { role } = req.query;
  let sql = 'SELECT id, name, email, phone, role, is_active, created_at FROM users WHERE 1=1';
  const params = [];
  if (role) { sql += ' AND role = ?'; params.push(role); }
  sql += ' ORDER BY created_at DESC';
  const [rows] = await db.query(sql, params);
  res.json(rows);
};

// Kích hoạt / vô hiệu hoá tài khoản
const toggleUserStatus = async (req, res) => {
  const [rows] = await db.query('SELECT is_active FROM users WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

  const newStatus = rows[0].is_active ? 0 : 1;
  await db.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, req.params.id]);
  res.json({ message: `Tài khoản đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hoá'}` });
};

// Tạo tài khoản bác sĩ (chỉ Admin mới được tạo)
const createDoctor = async (req, res) => {
  const { name, email, password, phone, specialty, degree, experience, bio } = req.body;
  if (!name || !email || !password || !specialty)
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });

  const [exist] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (exist.length) return res.status(409).json({ message: 'Email đã được sử dụng' });

  const hashed = await bcrypt.hash(password, 10);
  const [userResult] = await db.query(
    'INSERT INTO users (name, email, password, phone, role) VALUES (?,?,?,?,?)',
    [name, email, hashed, phone || null, 'doctor']
  );

  await db.query(
    'INSERT INTO doctors (user_id, specialty, degree, experience, bio) VALUES (?,?,?,?,?)',
    [userResult.insertId, specialty, degree || null, experience || 0, bio || null]
  );

  res.status(201).json({ message: 'Tạo tài khoản bác sĩ thành công', userId: userResult.insertId });
};

// Cập nhật thông tin bác sĩ
const updateDoctor = async (req, res) => {
  const { name, phone, specialty, degree, experience, bio } = req.body;

  const [doctor] = await db.query('SELECT user_id FROM doctors WHERE id = ?', [req.params.id]);
  if (!doctor.length) return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });

  await db.query('UPDATE users SET name = ?, phone = ? WHERE id = ?',
    [name, phone, doctor[0].user_id]);
  await db.query(
    'UPDATE doctors SET specialty = ?, degree = ?, experience = ?, bio = ? WHERE id = ?',
    [specialty, degree, experience, bio, req.params.id]
  );
  res.json({ message: 'Cập nhật thông tin bác sĩ thành công' });
};

// Thống kê tổng quan
const getStats = async (req, res) => {
  const [[{ total_patients }]] = await db.query(
    "SELECT COUNT(*) AS total_patients FROM users WHERE role = 'patient'"
  );
  const [[{ total_doctors }]] = await db.query(
    "SELECT COUNT(*) AS total_doctors FROM users WHERE role = 'doctor'"
  );
  const [[{ total_appointments }]] = await db.query(
    'SELECT COUNT(*) AS total_appointments FROM appointments'
  );
  const [byStatus] = await db.query(
    'SELECT status, COUNT(*) AS count FROM appointments GROUP BY status'
  );
  const [monthlyStats] = await db.query(`
    SELECT DATE_FORMAT(appt_date, '%Y-%m') AS month, COUNT(*) AS count
    FROM appointments
    WHERE appt_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY month ORDER BY month
  `);

  res.json({ total_patients, total_doctors, total_appointments, byStatus, monthlyStats });
};

module.exports = { getAllUsers, toggleUserStatus, createDoctor, updateDoctor, getStats };