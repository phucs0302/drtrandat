const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

// Đăng ký bệnh nhân
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });

  const [exist] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (exist.length) return res.status(409).json({ message: 'Email đã được sử dụng' });

  const hashed = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, phone, role) VALUES (?,?,?,?,?)',
    [name, email, hashed, phone || null, 'patient']
  );

  res.status(201).json({ message: 'Đăng ký thành công', userId: result.insertId });
};

// Đăng nhập (dùng chung mọi role)
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email và mật khẩu không được để trống' });

  const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
  if (!rows.length) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

// Lấy thông tin cá nhân
const getProfile = async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  res.json(rows[0]);
};

// Cập nhật thông tin cá nhân
const updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  await db.query('UPDATE users SET name = ?, phone = ? WHERE id = ?',
    [name, phone, req.user.id]);
  res.json({ message: 'Cập nhật thành công' });
};

module.exports = { register, login, getProfile, updateProfile };