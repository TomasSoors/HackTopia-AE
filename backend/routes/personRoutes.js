const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');

router.get('/id/:id', personController.getPersonById);
router.post('/login', personController.loginPerson);
router.get('/all/', personController.getAll);
router.get('/doctor/:id', personController.getIsDokter);
router.put('/update-diseases/:id', personController.updateDiseases);

module.exports = router;