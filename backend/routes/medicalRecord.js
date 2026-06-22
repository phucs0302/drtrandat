const router = require('express').Router();

const {
  createMedicalRecord
} = require('../controllers/medicalRecordController');

const {
  authenticate,
  authorize
} = require('../middleware/auth');

router.post(
  '/',
  authenticate,
  authorize('doctor'),
  createMedicalRecord
);

module.exports = router;