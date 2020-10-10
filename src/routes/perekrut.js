const express = require('express');
const perekrutController = require('../controllers/perekrut')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();

router
    // Register
    .post('/register',  perekrutController.register)
    // Login
    .post('/login', perekrutController.login)
    // Insert
    .post('/insert', authenticate, authorize, perekrutController.insert)
    // Refresh Token
    .post('/refreshToken', perekrutController.renewToken)
    // Logout
    .post('/logout/:idperekrut', perekrutController.logout)
    // Forgot Password
    .post('/ForgotPassword', perekrutController.ForgotPassword)
    // Send New Password
    .post('/newPassword/:userkey', perekrutController.newPassword)
    // Verify Token
    .get('/verify/:token', perekrutController.verify)
    // Get All
    .get('/getall', authenticate, authorize, perekrutController.getAll)
    // Get All Detail
    .get('/getDetail/:idperekrut', authenticate, authorize, perekrutController.getDetail)
    // Update 
    .patch('/update/:idperekrut', authenticate, authorize, perekrutController.update)
    // Delete
    .delete('/delete/:idperekrut', authenticate, authorize, perekrutController.delete)
    
module.exports = router;