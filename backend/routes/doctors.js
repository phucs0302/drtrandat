const router = require('express').Router();
const {
  getAllDoctors, getDoctorById, getDoctorSchedules,
  getMySchedules, createSchedule, updateSchedule,
  getMyAppointments,
} = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/auth');

// Doctor only — PHẢI đặt trước /:id để tránh Express hiểu "me" là một id
router.get('/me/schedules',      authenticate, authorize('doctor'), getMySchedules);
router.post('/me/schedules',     authenticate, authorize('doctor'), createSchedule);
router.put('/me/schedules/:id',  authenticate, authorize('doctor'), updateSchedule);
router.get('/me/appointments',   authenticate, authorize('doctor'), getMyAppointments);

// Public
router.get('/',                  getAllDoctors);
router.get('/:id',               getDoctorById);
router.get('/:id/schedules',     getDoctorSchedules);

module.exports = router;