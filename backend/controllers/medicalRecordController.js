const db = require('../config/db');

const createMedicalRecord = async (req, res) => {

  try {

    const {
      appointment_id,
      patient_id,
      symptoms,
      diagnosis,
      treatment_plan,
      notes
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO medical_records
      (
        appointment_id,
        patient_id,
        doctor_id,
        symptoms,
        diagnosis,
        treatment_plan,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        appointment_id,
        patient_id,
        req.user.id,
        symptoms,
        diagnosis,
        treatment_plan,
        notes
      ]
    );

    res.status(201).json({
      message: 'Lưu bệnh án thành công',
      id: result.insertId
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  createMedicalRecord
};