const db = require('../config/db');

// Helper: format Date object hoặc string về 'YYYY-MM-DD' theo local time
const toLocalDate = (val) => {
  if (!val) return null;
  const d = val instanceof Date ? val : new Date(val);
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Kiểm tra slot còn trống
const checkSlotAvailable = async (doctorId, apptDate, apptTime, excludeId = null) => {
  let sql = `SELECT id FROM appointments
             WHERE doctor_id = ? AND appt_date = ? AND appt_time = ? AND status != 'cancelled'`;
  const params = [doctorId, apptDate, apptTime];
  if (excludeId) { sql += ' AND id != ?'; params.push(excludeId); }
  const [rows] = await db.query(sql, params);
  return rows.length === 0;
};


// [Patient] Đặt lịch khám
const createAppointment = async (req, res) => {
  try {
    const { doctor_id, schedule_id, appt_date, appt_time, reason } = req.body;

    if (!doctor_id || !schedule_id || !appt_date || !appt_time)
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin đặt lịch' });

    // Kiểm tra lịch còn tồn tại & active
    const [schedRows] = await db.query(
      'SELECT * FROM doctor_schedules WHERE id = ? AND doctor_id = ? AND is_active = 1',
      [schedule_id, doctor_id]
    );

    if (!schedRows.length)
      return res.status(404).json({ message: 'Lịch làm việc không tồn tại hoặc đã đóng' });

    // So sánh work_date với appt_date (cả hai đều format về YYYY-MM-DD)
    const schedDate = toLocalDate(schedRows[0].work_date);
    if (schedDate !== appt_date)
      return res.status(400).json({ message: 'Ngày khám không khớp với lịch làm việc' });

    // Kiểm tra trùng lịch
    const available = await checkSlotAvailable(doctor_id, appt_date, appt_time);
    if (!available)
      return res.status(409).json({ message: 'Khung giờ này đã có người đặt, vui lòng chọn giờ khác' });

    // Kiểm tra bệnh nhân không đặt 2 lịch cùng bác sĩ trong ngày
    const [dup] = await db.query(
      `SELECT id FROM appointments
       WHERE patient_id = ? AND doctor_id = ? AND appt_date = ? AND status != 'cancelled'`,
      [req.user.id, doctor_id, appt_date]
    );
    if (dup.length)
      return res.status(409).json({ message: 'Bạn đã có lịch khám với bác sĩ này trong ngày' });

    const [result] = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, schedule_id, appt_date, appt_time, reason) VALUES (?,?,?,?,?,?)',
      [req.user.id, doctor_id, schedule_id, appt_date, appt_time, reason || null]
    );
    res.status(201).json({ message: 'Đặt lịch khám thành công', id: result.insertId });
  } catch (err) {
    console.error('createAppointment error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// [Patient] Xem lịch khám cá nhân
const getMyAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.id, a.appt_date, a.appt_time, a.status, a.reason, a.notes, a.created_at,
             u.name AS doctor_name, d.specialty, u.phone AS doctor_phone
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = d.user_id
      WHERE a.patient_id = ?
      ORDER BY a.appt_date DESC, a.appt_time DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error('getMyAppointments error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// [Patient] Huỷ lịch khám
const cancelAppointment = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM appointments WHERE id = ? AND patient_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy lịch khám' });
    if (rows[0].status === 'completed')
      return res.status(400).json({ message: 'Không thể huỷ lịch đã hoàn thành' });

    await db.query('UPDATE appointments SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
    res.json({ message: 'Huỷ lịch khám thành công' });
  } catch (err) {
    console.error('cancelAppointment error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// [Admin] Lấy tất cả lịch khám
const getAllAppointments = async (req, res) => {
  try {
    const { status, date, doctor_id } = req.query;
    let sql = `
      SELECT a.id, a.appt_date, a.appt_time, a.status, a.reason, a.notes, a.created_at,
             up.name AS patient_name, up.phone AS patient_phone,
             ud.name AS doctor_name, d.specialty
      FROM appointments a
      JOIN users up ON up.id = a.patient_id
      JOIN doctors d  ON d.id  = a.doctor_id
      JOIN users ud ON ud.id = d.user_id
      WHERE 1=1
    `;
    const params = [];
    if (status)    { sql += ' AND a.status = ?';     params.push(status); }
    if (date)      { sql += ' AND a.appt_date = ?';  params.push(date); }
    if (doctor_id) { sql += ' AND a.doctor_id = ?';  params.push(doctor_id); }
    sql += ' ORDER BY a.appt_date DESC, a.appt_time DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('getAllAppointments error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// [Admin/Doctor] Cập nhật trạng thái lịch khám
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });

    await db.query(
      'UPDATE appointments SET status = ?, notes = ? WHERE id = ?',
      [status, notes || null, req.params.id]
    );
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (err) {
    console.error('updateAppointmentStatus error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


module.exports = {
  createAppointment, getMyAppointments, cancelAppointment,
  getAllAppointments, updateAppointmentStatus,
};