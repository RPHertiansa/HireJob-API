const hireModel = require('../models/hire')
const perekrutModel = require('../models/perekrut')
const pekerjaModel = require('../models/pekerja')
const { success, failed } = require('../helpers/response')
const { mypassword, myemail, url, urlforgot } = require('../helpers/env')
const mailer = require('nodemailer')


const hire = {
    jobOffer: (req, res) => {
        try {
            const body = req.body
            const namalengkap = body.namalengkap
            const email = body.email
            const phone = body.phone
            const pesantujuan = body.pesantujuan
            const deskripsi = body.deskripsi
            
            hireModel.jobOffer(body)
            .then(() => {
                const idperekrut = body.idperekrut
                perekrutModel.getDetail(idperekrut)
                .then((result) => {
                    const jabatan = result[0].jabatan
                    const namaperusahaan = result[0].namaperusahaan
                    const idpekerja = body.idpekerja
                    pekerjaModel.getDetail(idpekerja)
                    .then((result) => {
                        const emailpekerja = result[0].emailpekerja
                        const namapekerja = result[0].namapekerja
                        console.log(namalengkap)
                        console.log(jabatan)
                        console.log(namaperusahaan)
                        console.log(namapekerja)
                        console.log(emailpekerja)
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
                            subject: 'Tawaran Pekerjaan',
                            html:
                            `
                            <!doctype html>
                            <html lang="en">
                            <head>
                                <!-- Required meta tags -->
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> 
                                <style>
                                @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
                                * {
                                    font-family: 'Open Sans', sans-serif;
                                }
                                body {
                                    padding: 0;
                                    margin: 0;
                                }
                                .footer{
                                background-color: #5E50A1 !important;
                                color: white;
                                padding: 25px;
                                }
                                .jumbotron {
                                    border-radius: 0% !important;
                                    padding: 25px;
                                    background-color: #E5E5E5;
                                    color: black;
                                }
                                .btn {
                                    padding: 5px;
                                    border: 1px solid #FBB017;
                                    border-radius: 25px;
                                    background-color: #FBB017;
                                    color: white;
                                    text-align: center;
                                    width: 200px;
                                    margin: 10px auto;
                                }
                                .btn:hover{
                                    transform: scale(1.02);
                                }
                                .hirebox {
                                    border: 1px solid #5E50A1;
                                    padding: 0px 15px;
                                }
                                </style>
                                <title>Aktivasi Akun</title>
                            </head>
                            <body>
                                <div>
                                    <div class="jumbotron">
                                        <h1>Tawaran Pekerjaan</h1>
                                        <p>Halo ${namapekerja}!</p>
                                        <p>Akun kamu terdaftar pada aplikasi Peworld dengan email : <span style="text-decoration: none;">${emailpekerja}</span></p>
                                        <p>Berikut adalah tawaran pekerjaan yang kamu terima:</p>
                                        <div class="hirebox">
                                            <p>Nama Perekrut: ${namalengkap}</p>
                                            <p>Posisi: ${jabatan} di ${namaperusahaan}</p>
                                            <p>Email:  <span style="text-decoration: none;">${email}</span></p>
                                            <p>Nomor telepon: ${phone}</p>
                                            <p>Pekerjaan yang ditawarkan: ${pesantujuan}</p>
                                            <p>Deskripsi: ${deskripsi}</p>
                                        </div>
                                        <div class="btn" href="http://localhost:8080/login-pekerja">Lihat di aplikasi</div>
                                    </div>
                                    <div class="footer">
                                        <img src="http://drive.google.com/uc?export=view&id=1lm-UanFAdguBaOh7uHHbwwFDBc90S7x-" style="width:120px ;" class="mt-5"> <br>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>In euismod ipsum et dui rhoncus auctor.</p>
                                        <hr style="background-color: white;">
                                        <p>2020 Peworld. All right reserved</p>
                                    </div>
                                </div>


                                <!-- Optional JavaScript -->
                                <!-- jQuery first, then Popper.js, then Bootstrap JS -->
                                <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
                                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
                                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>
                            </body>
                            </html>

                            `
                        }
                
                        transporter.sendMail(mailOptions, (err, result) => {
                            if (err) {
                            res.status(505)
                            failed(res, [], err.message)
                            } else {
                            success(res, [result], `Job offer sent!`)
                            // success(res, [result], `Send Mail Success`)
                            }
                        })
                    })

                    res.json({
                        message: `Job offer sent!`
                    })
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