const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  saveDietPlan,
  getDietPlan,
  deleteDietPlan,
} = require('../controllers/dietController');

router.post('/saveDietPlan', verifyToken, saveDietPlan);
router.get('/getDietPlan', verifyToken, getDietPlan);
router.delete('/deleteDietPlan', deleteDietPlan);

module.exports = router;
