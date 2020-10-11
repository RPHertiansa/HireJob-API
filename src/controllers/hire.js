const hireModel = require('../models/hire')
const perekrutModel = require('../models/perekrut')
const pekerjaModel = require('../models/pekerja')
const { success, failed, tokenStatus,successWithMeta, notfound } = require('../helpers/response')
const { JWT_KEY, mypassword, myemail, url, urlforgot } = require('../helpers/env')
const upload = require('../helpers/uploads')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const response = require('../helpers/response')


const hire = {
    jobOffer: (req, res) => {
        try {
            const body = req.body
            
            hireModel.jobOffer(body)
            .then((result) => {
                const idpekerja = body.idpekerja
                pekerjaModel.getDetail(idpekerja)
                .then((result) => {
                    emailpekerja = result[0].emailpekerja
                    namapekerja = result[0].namapekerja
                    let transporter = mailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                          user: myemail,
                          pass: mypassword
                        }
                      })
            
                      let mailOptions = {
                        from: `PEWORLD ${myemail}`,
                        to: `reyhertiansa@gmail.com`,
                        subject: `HELLO Reynaldi Putra`,
                        html:
                          `Hai, kamu mendapatkan tawaran pekerjaan`
                      }
            
                      transporter.sendMail(mailOptions, (err, result) => {
                        if (err) {
                          res.status(505)
                          failed(res, [], err.message)
                        } else {
                          success(res, [result], `Success Registration, Please activate your email`)
                          // success(res, [result], `Send Mail Success`)
                        }
                      })
                })

                res.json({
                    message: `Success Registration, Please activate your email`
                  })
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error')
        }
    },
    getAll: (req, res) => {
        try {
            hireModel.getAll()
            .then((result) => {
                success(res, result, 'Get all data success')
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error')
        }
    },
    getDetail: (req, res) => {
        try {
            const idhire = req.params.idhire
            hireModel.getDetail(idhire)
            .then((result) => {
                success(res, result, 'Get detail success')
            })
            .catch((err) => {
                failed(res, [], err.message)
            })
        } catch (error) {
            failed(res, [], 'Internal server error')
        }
    }
}


module.exports = hire