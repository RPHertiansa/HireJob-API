const express = require('express');
const hireController = require('../controllers/hire')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();

router
    .post('/joboffer', hireController.jobOffer)
    .get('/getall', hireController.getAll)
    .get('/getdetail/:idhire', hireController.getDetail)
    .get('/find/pekerja/:idperekrut', hireController.cariPekerja)
    .get('/find/perekrut/:idpekerja', hireController.cariPerekrut)
    

module.exports = router;