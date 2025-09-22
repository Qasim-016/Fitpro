const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const dietPlanController = require("../controllers/dietPlanController");

router.post("/saveDietPlan", verifyToken, dietPlanController.saveDietPlan);
router.get("/getDietPlan", verifyToken, dietPlanController.getDietPlan);
router.delete("/deleteDietPlan", verifyToken, dietPlanController.deleteDietPlan);

module.exports = router;
