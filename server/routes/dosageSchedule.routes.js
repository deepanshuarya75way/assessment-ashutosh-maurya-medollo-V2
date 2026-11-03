const express = require('express');
const router = express.Router();

const {protect} = require('../middleware/auth.middleware');

const {
   getAgenda, logDose,
  undoDoseLog,
  getAdherenceStats,
  updateDosageSchedule,
  togglePause
} = require('../controllers/dosageSchedule.controller');

router.get('/agenda', protect, getAgenda);
router.post('/log', protect, logDose);
router.delete('./log/:logId', protect, undoDoseLog);
router.get('/adherence', protect, getAdherenceStats);
router.put('/:medicineId', protect, updateDosageSchedule);
router.patch('/:medicineId/pause', protect, togglePause);

module.exports = router;