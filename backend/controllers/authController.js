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
  try {

    const [users] = await db.query(
      `SELECT id,name,email,phone,role
       FROM users
       WHERE id=?`,
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({
        message: 'Không tìm thấy người dùng'
      });
    }

    const user = users[0];

    if (user.role === 'doctor') {

      const [doctor] = await db.query(
        `SELECT specialty,
                degree,
                experience,
                bio
         FROM doctors
         WHERE user_id=?`,
        [req.user.id]
      );

      if (doctor.length) {
        user.doctorInfo = doctor[0];
      }
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Cập nhật thông tin cá nhân
const updateProfile = async (req, res) => {

  try {

    console.log(req.body);

    const {
      name,
      phone,
      specialty,
      degree,
      experience,
      bio
    } = req.body;

    await db.query(
      `UPDATE users
       SET name=?,
           phone=?
       WHERE id=?`,
      [
        name,
        phone,
        req.user.id
      ]
    );

    const [users] = await db.query(
      'SELECT role FROM users WHERE id=?',
      [req.user.id]
    );

    if (
      users.length &&
      users[0].role === 'doctor'
    ) {

      await db.query(
        `UPDATE doctors
         SET specialty=?,
             degree=?,
             experience=?,
             bio=?
         WHERE user_id=?`,
        [
          specialty,
          degree,
          experience,
          bio,
          req.user.id
        ]
      );
    }

    res.json({
      message: 'Cập nhật thành công'
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
const changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Xác nhận mật khẩu không khớp'
      });
    }

    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({
        message: 'Không tìm thấy người dùng'
      });
    }

    const user = users[0];

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

console.log(typeof changePassword);

module.exports = { register, login, getProfile, updateProfile, changePassword };