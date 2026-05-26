const router = require('express').Router();
const {
  createAppointment, getMyAppointments, cancelAppointment,
  getAllAppointments, updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/auth');

// Patient
router.post('/',           authenticate, authorize('patient'), createAppointment);
router.get('/mine',        authenticate, authorize('patient'), getMyAppointments);
router.put('/:id/cancel',  authenticate, authorize('patient'), cancelAppointment);

// Admin — dùng path riêng /all để tránh conflict với POST /
router.get('/all',         authenticate, authorize('admin'),          getAllAppointments);
router.put('/:id/status',  authenticate, authorize('admin','doctor'), updateAppointmentStatus);

module.exports = router;