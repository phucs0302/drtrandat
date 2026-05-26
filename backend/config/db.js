const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
});

const seedUsers = [
  {
    name: 'Admin',
    email: 'test123@gmail.com',
    password: '111111111',
    phone: '0900000000',
    role: 'admin'
  },
  {
    name: 'BS. Nguyễn Văn An',
    email: 'bsnguyenan@hospital.com',
    password: '111111111',
    phone: '0911111111',
    role: 'doctor'
  },
  {
    name: 'Phạm Quốc Dũng',
    email: 'dungpham@gmail.com',
    password: '111111111',
    phone: '0944444444',
    role: 'patient'
  }
];

const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    console.log('✅ Đã kết nối MySQL Railway thành công.');

    for (const user of seedUsers) {
      const [rows] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [user.email]
      );

      if (rows.length === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        await connection.execute(
          'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
          [user.name, user.email, hashedPassword, user.phone, user.role]
        );

        console.log(`🔹 Đã tạo tài khoản: ${user.email}`);
      }
    }

    connection.release();

  } catch (err) {
    console.error('❌ Lỗi khởi tạo dữ liệu:', err.message);
  }
};

initDatabase();

module.exports = pool;