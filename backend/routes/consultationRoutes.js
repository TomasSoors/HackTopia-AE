const express = require("express");
const router = express.Router();
const {
  addConsultation,
  getConsultationsByPatient,
} = require("../controllers/consultationController");

router.post("/add", addConsultation);
router.get("/:patientId", getConsultationsByPatient);

module.exports = router;
