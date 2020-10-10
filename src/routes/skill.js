const express = require('express');
const skillController = require('../controllers/skill')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();

router
    // Get All fiter by id pekerja
    .get('/getall/:id',  skillController.getall)
    // Insert
    // .post('/insert', authenticate, authorize, skillController.insert)
    .post('/insert', skillController.insert)
    // Update by id skill
    // .patch('/update/:id', authenticate, authorize, skillController.update)
    .patch('/update/:id', skillController.update)
    // Delete by id skill
    // .delete('/delete/:id', authenticate, authorize, skillController.delete)
    .delete('/delete/:id', skillController.delete)

module.exports = router;