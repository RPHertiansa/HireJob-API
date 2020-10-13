const pekerjaModel = require('../models/pekerja')
const { success, failed, tokenStatus,successWithMeta, notfound } = require('../helpers/response')
const { JWT_KEY, mypassword, myemail, url, urlforgot } = require('../helpers/env')
const upload = require('../helpers/uploads')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const response = require('../helpers/response')

const pekerja = {
  register: async (req, res) => {
    try {
      const body = req.body

      const salt = await bcrypt.genSalt(10)
      const hashWord = await bcrypt.hash(body.passwordpekerja, salt)

      const data = {
        namapekerja: body.namapekerja,
        emailpekerja: body.emailpekerja,
        phonepekerja: body.phonepekerja,
        passwordpekerja: hashWord,
        tipepekerjaan: 0,
        refreshToken: null,
        imagepekerja: '404.png'
      }
      pekerjaModel.register(data)
        .then(() => {
          const hashWord = jwt.sign({
            emailpekerja: data.emailpekerja,
            namapekerja: data.namapekerja
          }, JWT_KEY)

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
            to: data.emailpekerja,
            subject: `HELLO ${data.namapekerja}`,
            html:
              `Hai <h1><b>${data.namapekerja}<b></h1> </br>
                    PLEASE ACTIVATE YOUR EMAIL ! <br>
                    and You can Login with your <b>Nama Pekerja : ${data.namapekerja}<b> <br>
                    KLIK --> <a href="${url}pekerja/verify/${hashWord}"> Activation</a>  <---`
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

          res.json({
            message: `Success Registration, Please activate your email`
          })
        })
        .catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], 'Internal server error!')
    }
  },
  verify: (req, res) => {
    const token = req.params.token
    if (token) {
      jwt.verify(token, JWT_KEY, (err, decode) => {
        if (err) {
          res.status(505)
          failed(res, [], `Failed Activation`)
        } else {
          const emailpekerja = decode.emailpekerja
          const namapekerja = decode.namapekerja
          pekerjaModel.getpekerja(emailpekerja)
            .then((result) => {
              if (result.affectedRows) {
                res.status(200)
                // success(res, {email}, `Congrats Gaes`)
                res.render('pekerja', { emailpekerja, namapekerja })
              } else {
                res.status(505)
                failed(res, [], err.message)
              }
            })
            .catch((err) => {
              res.status(505)
              response.failed(res, [], err.message)
            })
        }
      })
    }
  },
  login: async (req, res) => {
    try {
      const body = req.body
      pekerjaModel.login(body)
        .then(async (result) => {
          const userData = result[0]
          const hashWord = userData.passwordpekerja
          const userRefreshToken = userData.refreshToken
          const correct = await bcrypt.compare(body.passwordpekerja, hashWord)

          if (correct) {
            if (userData.is_active === 1) {
              jwt.sign(
                {
                  emailpekerja: userData.emailpekerja,
                  namapekerja: userData.namapekerja
                },
                JWT_KEY,
                { expiresIn: 120 },

                (err, token) => {
                  if (err) {
                    console.log(err)
                  } else {
                    if (userRefreshToken === null) {
                      const idpekerja = userData.idpekerja
                      const refreshToken = jwt.sign(
                        { idpekerja }, JWT_KEY)
                      pekerjaModel.updateRefreshToken(refreshToken, idpekerja)
                        .then(() => {
                          const data = {
                            idpekerja: userData.idpekerja,
                            namapekerja: userData.namapekerja,
                            emailpekerja: userData.emailpekerja,
                            status: 'pekerja',
                            token: token,
                            refreshToken: refreshToken
                          }
                          tokenStatus(res, data, 'Login Success')
                        }).catch((err) => {
                          failed(res, [], err.message)
                        })
                    } else {
                      const data = {
                        idpekerja: userData.idpekerja,
                        namapekerja: userData.namapekerja,
                        emailpekerja: userData.emailpekerja,
                        status: 'pekerja',
                        token: token,
                        refreshToken: userRefreshToken
                      }
                      tokenStatus(res, data, 'Login Success')
                    }
                  }
                }
              )
            } else {
              failed(res, [], "Need Activation")
            }
          } else {
            failed(res, [], "Incorrect password! Please try again")
          }
        })
        .catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], 'Internal server error!')
    }
  },
  renewToken: (req, res) => {
    const refreshToken = req.body.refreshToken
    pekerjaModel.checkRefreshToken(refreshToken)
      .then((result) => {
        if (result.length >= 1) {
          const pekerja = result[0];
          const newToken = jwt.sign(
            {
              emailpekerja: pekerja.emailpekerja,
              namapekerja: pekerja.namapekerja
            },
            JWT_KEY,
            { expiresIn: 3600 }
          )
          const data = {
            token: newToken,
            refreshToken: refreshToken
          }
          tokenStatus(res, data, `The token has been refreshed successfully`)
        } else {
          failed(res, [], `Refresh token not found`)
        }
      }).catch((err) => {
        failed(res, [], err.message)
      })
  },
  logout: (req, res) => {
    try {
      const destroy = req.params.idpekerja
      pekerjaModel.logout(destroy)
        .then((result) => {
          success(res, result, `Logout Success`)
        }).catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], `Internal Server Error`)
    }
  },
  ForgotPassword: (req, res) => {
    try {
      const body = req.body
      const email = body.emailpekerja
      pekerjaModel.getEmailpekerja(email)
        .then(() => {
          const userKey = jwt.sign({
            emailpekerja: email,
          }, JWT_KEY)
          pekerjaModel.updateUserKey(userKey, email)
            .then(async () => {
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
                to: email,
                subject: `Reset Password ${email}`,
                html:
                  `Hai
                        This is an email to reset the password
                        KLIK --> <a href="${urlforgot}/resetpass-pekerja?userkey=${userKey}">Klik this link for Reset Password</a>  <---`
              }

              transporter.sendMail(mailOptions, (err, result) => {
                if (err) {
                  res.status(505)
                  failed(res, [], err.message)
                } else {
                  success(res, [result], `Send Mail Success`)
                }
              })
              res.json({
                message: `Please Check Email For Reset Password`
              })
            }).catch((err) => {
              failed(res, [], err)
            })
        }).catch((err) => {
          failed(res, [], err)
        })
    } catch (error) {
      failed(res, [], `Internal Server Error`)
    }
  },
  newPassword: async (req, res) => {
    try {
      const body = req.body

      const salt = await bcrypt.genSalt(10)
      const hashWord = await bcrypt.hash(body.passwordpekerja, salt)

      const key = req.params.userkey

      pekerjaModel.newPassword(hashWord, key)

        .then((result) => {
          success(res, result, `Update Password Success`)
          jwt.verify(key, JWT_KEY, (err, decode) => {
            if (err) {
              res.status(505)
              failed(res, [], `Failed Reset userkey`)
            } else {
              const email = decode.emailpekerja
              pekerjaModel.resetKey(email)
                .then((results) => {
                  if (results.affectedRows) {
                    res.status(200)
                    success(res, results, `Update Password Success`)
                  } else {
                    res.status(505)
                    // failed(res,[],err.message)
                  }
                }).catch((err) => {
                  // failed(res, [], err)
                })
            }
          })
        }).catch((err) => {
          failed(res, [], err)
        })
    } catch (error) {
      failed(res, [], `Internal Server Error`)
    }
  },
  // getAll: (req, res) => {
  //   try {
  //     pekerjaModel.getAll()
  //       .then((result) => {
  //         success(res, result, 'Here are the users that data you requested')
  //       })
  //       .catch((err) => {
  //         failed(res, [], err)
  //       })
  //   } catch (error) {
  //     failed(res, [], 'Internal server error!')
  //   }
  // },
  getAll: (req, res) => {
    try {
      const skill = !req.query.skill ? "" : req.query.skill;
      const sortby = !req.query.sortby ? "idpekerja" : req.query.sortby;
      const sorttype = !req.query.sorttype ? "ASC" : req.query.sorttype;
      
      const limit = !req.query.limit ? 10 : parseInt(req.query.limit);
      const page = !req.query.page ? 1 : parseInt(req.query.page);
      const offset = page <= 1 ? 0 : (page - 1) * limit;


      pekerjaModel.getAll(skill,sortby,sorttype,limit,offset)
        .then((result) => {
          if (result.length < 1) {
            notfound(res,[],'Data not found!')
          } else {
            const totalRows = result[0].count;
            const meta = {
            total: totalRows,
            totalPage: Math.ceil(totalRows / limit),
            page: page,
            }
            successWithMeta(res, result, meta, 'Here are the users that data you requested')
          }
        })
        .catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], 'Internal server error!')
    }
  },
  getDetail: (req, res) => {
    try {
      const idpekerja = req.params.idpekerja
      pekerjaModel.getDetail(idpekerja)
        .then((result) => {
          success(res, result, `Here is the data of users with id ${idpekerja}`)
        })
        .catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], 'Internal server error!')
    }
  },
  insert: (req, res) => {
    try {
      upload.single('image')(req, req, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            failed(res, [], 'Image size is too big! Please upload another one with size <5mb')
          } else {
            failed(res, [], err)
          }
        } else {
          const body = req.body
          body.image = req.file.filename
          pekerjaModel.insert(body)
            .then((result) => {
              success(res, result, 'Image is uploaded successfully')
            })
            .catch((err) => {
              failed(res, [], err.message)
            })
        }
      })
    } catch (error) {
      failed(res, [], 'Internal server error!')
    }
  },
  update: (req, res) => {
    try {
      upload.single('imagepekerja')(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            failed(res, [], 'Image size is too big! Please upload another one with size <5mb')
          } else {
            failed(res, [], err)
          }
        } else { 
          const idpekerja = req.params.idpekerja
          const body = req.body
          pekerjaModel.getDetail(idpekerja)
            .then((result) => {
              const oldImg = result[0].imagepekerja
              body.imagepekerja = !req.file ? oldImg : req.file.filename
              if (body.imagepekerja !== oldImg) {
                if (oldImg !== '404.png') {
                  fs.unlink(`src/uploads/${oldImg}`, (err) => {
                    if (err) {
                      failed(res, [], err.message)
                    } else {
                      pekerjaModel.update(body, idpekerja)
                        .then((result) => {
                          success(res, result, 'Update success')
                        })
                        .catch((err) => {
                          failed(res, [], err.message)
                        })
                    }
                  })
                } else {
                  pekerjaModel.update(body, idpekerja)
                    .then((result) => {
                      success(res, result, 'Update success')
                    })
                    .catch((err) => {
                      failed(res, [], err.message)
                    })
                }
              } else {
                pekerjaModel.update(body, idpekerja)
                  .then((result) => {
                    success(res, result, 'Update success')
                  })
                  .catch((err) => {
                    failed(res, [], err.message)
                  })
              }
            })
        }
      })
    } catch (error) {
      failed(res, [], 'Internal server error!')
    }
  },
  delete: (req, res) => {
    try {
      const idpekerja = req.params.idpekerja
      pekerjaModel.getDetail(idpekerja)
        .then((result) => {
          const image = result[0].imagepekerja
          if (image === '404.png') {
            pekerjaModel.delete(idpekerja)
              .then((result) => {
                success(res, result, `User with id=${idpekerja} is deleted!`)
              })
              .catch((err) => {
                failed(res, [], err.message)
              })
          } else {
            fs.unlink(`src/uploads/${image}`, (err) => {
              if (err) {
                failed(res, [], err.message)
              } else {
                pekerjaModel.delete(idpekerja)
                  .then((result) => {
                    success(res, result, `User with id ${idpekerja} is deleted!`)
                  })
                  .catch((err) => {
                    failed(res, [], err.message)
                  })
              }
            })
          }
        })
        .catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], 'Internal server error!')
    }
  }
}


module.exports = pekerja