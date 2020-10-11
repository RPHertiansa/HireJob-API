const express = require('express')
const portofolioController = require('../controllers/portofolio')
const { authenticate, authorize } = require('../helpers/auth');
const { getall } = require('../models/portofolio');

const router = express.Router();

router
    // getall
    .get('/getall/:id', portofolioController.getall)
    // getdetail
    .get('/getdetail/:id', portofolioController.getdetail)
    

module.exports = router;