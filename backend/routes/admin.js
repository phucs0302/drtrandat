const router = require('express').Router();
const { getAllUsers, toggleUserStatus, createDoctor, updateDoctor, getStats } =
  require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

const adminOnly = [authenticate, authorize('admin')];

router.get('/users',             ...adminOnly, getAllUsers);
router.put('/users/:id/toggle',  ...adminOnly, toggleUserStatus);
router.post('/doctors',          ...adminOnly, createDoctor);
router.put('/doctors/:id',       ...adminOnly, updateDoctor);
router.get('/stats',             ...adminOnly, getStats);

module.exports = router;