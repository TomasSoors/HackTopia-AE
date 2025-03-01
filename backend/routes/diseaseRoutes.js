const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');

router.get('/:id', diseaseController.getDiseaseById);
router.get('/all', diseaseController.getAll);

module.exports = router;