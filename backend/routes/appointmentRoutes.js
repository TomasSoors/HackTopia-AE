const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/doctor/:doctorId', appointmentController.getDoctorAppointments);
router.get('/patient/:patientId', appointmentController.getPatientAppointments);
router.post('/book', appointmentController.bookAppointment);
router.post('/generate-slots', appointmentController.generateAvailableSlots);
router.put('/confirm/:appointmentId', appointmentController.confirmAppointment);
router.put('/cancel/:appointmentId', appointmentController.cancelAppointment);
router.get("/patient/:id", appointmentController.getAppointmentsByPatient);
router.get("/doctor/:doctorId/patient/:patientId", appointmentController.getDoctorPatientAppointments);

module.exports = router;
