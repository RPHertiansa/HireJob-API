const express = require('express');
const pengalamanController = require('../controllers/pengalaman')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();

router
    // Get All fiter by id pekerja
    .get('/getall/:id',  pengalamanController.getall)
    // Insert
    // .post('/insert', authenticate, authorize, pengalamanController.insert)
    .post('/insert', pengalamanController.insert)
    // Update by id pengalaman
    // .patch('/update/:id', authenticate, authorize, pengalamanController.update)
    .patch('/update/:id', pengalamanController.update)
    // Delete by id pengalaman
    // .delete('/delete/:id', authenticate, authorize, pengalamanController.delete)
    .delete('/delete/:id', pengalamanController.delete)

module.exports = router;