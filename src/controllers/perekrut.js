const perekrutModel = require('../models/perekrut')
const { success, failed, tokenStatus } = require('../helpers/response')
const { JWT_KEY, myemail, mypassword, url } = require('../helpers/env')
const upload = require('../helpers/uploads')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const response = require('../helpers/response')

const perekrut = {
    register: async (req, res) => {
        try {
            const body = req.body

            const salt = await bcrypt.genSalt(10)
            const hashWord = await bcrypt.hash(body.passwordperekrut, salt)

            const data = {
                namaperekrut : body.namaperekrut,
                emailperekrut : body.emailperekrut,
                phoneperekrut : body.phoneperekrut,
                passwordperekrut : hashWord,
                jabatan : body.jabatan,
                namaperusahaan : body.namaperusahaan
            }

            perekrutModel.register(data)
            .then(() => {
                const hashWord = jwt.sign({
                    emailperekrut: data.emailperekrut,
                    namaperekrut: data.namaperekrut
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
                    to: data.emailperekrut,
                    subject: `HELLO ${data.namaperekrut}`,
                    html:
                        `Hai <h1><b>${data.namaperekrut}<b></h1> </br>
                    PLEASE ACTIVATE YOUR EMAIL ! <br>
                    and You can Login with your <b>Nama Perekrut : ${data.namaperekrut}<b> <br>
                    CLICK --> <a href="${url}perekrut/verify/${hashWord}"> Activation</a>  <---`
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
    verify: (req,res) => {
        const token = req.params.token
        if(token) {
            jwt.verify(token, JWT_KEY, (err,decode) => {
                if(err){
                    res.status(505)
                    failed(res, [], `Failed Activation`)
                }else{
                    const emailperekrut = decode.emailperekrut
                    const namaperekrut = decode.namaperekrut
                    perekrutModel.activatePerekrut(emailperekrut)
                    .then((result) => {
                        if(result.affectedRows){
                            res.status(200)
                            res.render('perekrut', {emailperekrut, namaperekrut})
                        }else{
                            res.status(505)
                            failed(res, [], err.message)
                        }
                    })
                    .catch((err)=>{
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
            perekrutModel.login(body)

            .then(async(result) => {
                const userData = result[0]
                const hashWord = userData.passwordperekrut
                const userRefreshToken = userData.refreshToken
                const correct = await bcrypt.compare(body.passwordperekrut, hashWord)

                if (correct) {
                    if(userData.is_active === 1){
                        jwt.sign(
                            { 
                              emailperekrut : userData.emailperekrut,
                              namaperekrut : userData.namaperekrut,
                            },
                            JWT_KEY,
                            { expiresIn: 3600 },
    
                            (err, token) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    if(userRefreshToken === null){
                                        const id = userData.idperekrut
                                        const refreshToken = jwt.sign( 
                                            {id} , JWT_KEY)
                                        perekrutModel.updateRefreshToken(refreshToken,id)
                                        .then(() => {
                                            const data = {
                                                idperekrut: userData.idperekrut,
                                                emailperekrut: userData.emailperekrut,
                                                status: 'perekrut',
                                                token: token,
                                                refreshToken: refreshToken
                                            }
                                            tokenStatus(res, data, 'Login Success')
                                        }).catch((err) => {
                                            failed(res,[], err.message)
                                        })
                                    }else{
                                        const data = {
                                            idperekrut: userData.idperekrut,
                                            emailperekrut: userData.emailperekrut,
                                            status: 'perekrut',
                                            token: token,
                                            refreshToken: refreshToken
                                        }
                                        tokenStatus(res, data, 'Login Success')
                                    }
                                }
                            }
                        ) 
                    }else{
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
    renewToken: (req, res) =>{
        const refreshToken = req.body.refreshToken
        perekrutModel.checkRefreshToken(refreshToken)
        .then((result)=>{
            if(result.length >=1){
                const userData = result[0];
                const newToken = jwt.sign(
                    {
                        emailperekrut : userData.emailperekrut,
                        namaperekrut : userData.namaperekrut 
                    },
                    JWT_KEY,
                    {expiresIn: 3600}
                )
                const data = {
                    token: newToken,
                    refreshToken: refreshToken
                }
                tokenStatus(res,data, `The token has been refreshed successfully`)
            }else{
                failed(res,[], `Refresh token not found`)
            }
        }).catch((err) => {
            failed(res, [], err.message)
        })
    },
    logout: (req,res) => {
        try {
            const idperekrut = req.params.idperekrut
            perekrutModel.logout(idperekrut)
            .then((result) => {
                success(res,result, `Logout Success`)
            }).catch((err) => {
                failed(res,[], err.message)
            })
        } catch (error) {
            failed(res, [], `Internal Server Error`)
        }
    },
    ForgotPassword: (req,res) => {
        try {
            const body = req.body
            const emailperekrut = body.emailperekrut
            perekrutModel.getEmailPerekrut(emailperekrut)

            .then(() => {
                const userkey = jwt.sign({
                    emailperekrut: body.emailperekrut,
                    namaperekrut: body.namaperekrut
                }, JWT_KEY)

                perekrutModel.updateUserKey(userkey,emailperekrut)
                .then(async() => {
                    let transporter = mailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth:{
                            user: myemail,
                            pass: mypassword
                        }
                    })
    
                    let mailOptions = {
                        from    : `ANKASA ${myemail}`,
                        to      : body.email,
                        subject : `Reset Password ${body.emailperekrut}`,
                        html:
                        `Hai
                        This is an email to reset the password
                        KLIK --> <a href="${urlforgot}/forgot?userkey=${userkey}">Klik this link for Reset Password</a>  <---`
                    }
    
                    transporter.sendMail(mailOptions,(err, result) => {
                        if(err) {
                            res.status(505)
                            failed(res, [], err.message)
                        } else {
                            success(res, [result], `Send Mail Success`)
                        }
                    })
                    res.json({
                        message: `Please Check Email For Reset Password`
                    })
                }).catch((err) =>{
                    failed(res, [], err)
                })
            }).catch((err) =>{
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
            const hashWord = await bcrypt.hash(body.password, salt)

            const key = req.params.userkey

            perekrutModel.newPassword(hashWord ,key)

            .then((result) => {
                success(res, result, `Update Password Success`)
                jwt.verify(key, JWT_KEY, (err,decode) =>{
                    if(err){
                        res.status(505)
                        failed(res, [], `Failed Reset userkey`)
                    }else{
                        const email = decode.email
                        console.log(email)
                        perekrutModel.resetKey(email)
                        .then((results) => {
                            if(results.affectedRows){
                                res.status(200)
                                success(res, results, `Update Password Success`)
                            }else{
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
    getAll: (req, res) => {
        try {
            const body = req.params.body
            perekrutModel.getAll()
            .then((result) => {
                success(res, result, 'Here are the perekrut that data you requested')
            })
            .catch((err) => {
                failed(res, [], err)
            })
        } catch (error) {
            failed(res, [], 'Internal server error!')
        }
    },
    getDetail: (req, res) => {
        try {
            const iduser = req.params.iduser
            perekrutModel.getDetail(iduser)
            .then((result) => {
                success(res, result, `Here is the data of perekrut with id ${iduser}`)
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
                if(err) {
                    if(err.code === 'LIMIT_FILE_SIZE'){
                        failed(res, [], 'Image size is too big! Please upload another one with size <5mb')
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const body = req.body
                    body.image = req.file.filename
                    perekrutModel.insert(body)
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
    update:(req, res) => {
        try {
            upload.single('image')(req, res, (err) => {
                if(err){
                    if(err.code === 'LIMIT_FILE_SIZE'){
                        failed(res, [], 'Image size is too big! Please upload another one with size <5mb')
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const iduser = req.params.iduser
                    const body = req.body
                    perekrutModel.getDetail(iduser)
                    .then((result) => {
                        const oldImg = result[0].image
                        body.image = !req.file ? oldImg: req.file.filename
                        if (body.image !== oldImg) {
                            if (oldImg !== '404.png') {
                                fs.unlink(`src/uploads/${oldImg}`, (err) => {
                                    if (err) {
                                        failed(res, [], err.message)
                                    } else {
                                        perekrutModel.update(body, iduser)
                                            .then((result) => {
                                                success(res, result, 'Update success')
                                            })
                                            .catch((err) => {
                                                failed(res, [], err.message)
                                            })
                                    }
                                })
                            } else {
                                perekrutModel.update(body, iduser)
                                    .then((result) => {
                                        success(res, result, 'Update success')
                                    })
                                    .catch((err) => {
                                        failed(res, [], err.message)
                                    })
                            }
                        } else {
                            perekrutModel.update(body, iduser)
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
            const iduser = req.params.iduser
            perekrutModel.getDetail(iduser)
            .then((result) => {
                const image = result[0].image
                if(image === '404.png'){
                    perekrutModel.delete(iduser)
                    .then((result) => {
                        success(res, result, `User with id=${iduser} is deleted!`)
                    })
                    .catch((err) => {
                        failed(res, [], err.message)
                    })
                }else{
                    fs.unlink(`src/uploads/${image}`, (err) => {
                        if(err) {
                            failed(res, [], err.message)
                        } else {
                            perekrutModel.delete(iduser)
                            .then((result) => {
                                success(res, result, `User with id ${iduser} is deleted!`)
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


module.exports = perekrut