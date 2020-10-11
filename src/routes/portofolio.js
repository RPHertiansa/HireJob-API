const express = require('express')
const portofolioController = require('../controllers/portofolio')
const { authenticate, authorize } = require('../helpers/auth');

const router = express.Router();

router
    // getall
    .get('/getall/:id', portofolioController.getall)
    // getdetail
    .get('/getdetail/:id', portofolioController.getdetail)
    // insert
    .post('/insert', portofolioController.insert)
    // update
    .patch('/update/:id', portofolioController.update)
    //delete
    .delete('/delete/:id', portofolioController.delete)
    

module.exports = router;