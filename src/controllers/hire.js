const hireModel = require('../models/hire')
const { success, failed, tokenStatus } = require('../helpers/response')
const { JWT_KEY, myemail, mypassword, url, urlforgot } = require('../helpers/env')
const upload = require('../helpers/uploads')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const response = require('../helpers/response')

const hire = {

}


module.exports = hire