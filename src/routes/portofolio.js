const express = require('express')
const portofolioController = require('../controllers/portofolio')
const { authenticate, authorize } = require('../helpers/auth');

const router = express.Router();

router
    // getall
    .get('/getall/:id', authenticate, authorize, portofolioController.getall)
    // getdetail
    .get('/getdetail/:id', authenticate, authorize, portofolioController.getdetail)
    // insert
    .post('/insert', authenticate, authorize, portofolioController.insert)
    // update
    .patch('/update/:id', authenticate, authorize, portofolioController.update)
    //delete
    .delete('/delete/:id', authenticate, authorize, portofolioController.delete)
    

module.exports = router;