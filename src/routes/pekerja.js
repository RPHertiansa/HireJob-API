const express = require('express');
const pekerjaController = require('../controllers/pekerja')
const { authenticate, authorize } = require('../helpers/auth')

const router = express.Router();

router
  // Register
  .post('/register', pekerjaController.register)
  // Login
  .post('/login', pekerjaController.login)
  // Insert
  .post('/insert', authenticate, authorize, pekerjaController.insert)
  // Refresh Token
  .post('/refreshToken', pekerjaController.renewToken)
  // Logout
  .post('/logout/:idpekerja', pekerjaController.logout)
  // Forgot Password
  .post('/ForgotPassword', pekerjaController.ForgotPassword)
  // Send New Password
  .post('/newPassword/:userkey', pekerjaController.newPassword)
  // Verify Token
  .get('/verify/:token', pekerjaController.verify)
  // Get All
  .get('/getall', authenticate, authorize, pekerjaController.getAll)
  // Get All Detail
  .get('/getDetail/:idpekerja', authenticate, authorize, pekerjaController.getDetail)
  // Update 
  .patch('/update/:idpekerja', authenticate, authorize, pekerjaController.update)
  // Delete
  .delete('/delete/:idpekerja', authenticate, authorize, pekerjaController.delete)

module.exports = router;