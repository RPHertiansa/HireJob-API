const express = require('express');
const hireController = require('../controllers/hire')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();

router
    .post('/joboffer', hireController.jobOffer)
    .get('/getall', hireController.getAll)
    
    

module.exports = router;