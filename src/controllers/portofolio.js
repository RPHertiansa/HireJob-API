const portofolioModel = require('../models/portofolio')
const { success, failed } = require('../helpers/response')
const { update } = require('lodash')
const upload = require('../helpers/uploads')
const fs = require('fs')

const portofolio = {
  getall: (req, res) => {
    try {
      const id = req.params.id
      portofolioModel.getall(id)
      .then((result) => {
        success(res, result, 'Get Data Success')
      })
      .catch((err) => {
        failed(res, [], err.message)
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  getdetail: (req, res) => {
    try {
      const id = req.params.id
      portofolioModel.getdetail(id)
      .then((result) => {
        success(res, result, `Get Data With id ${id} Success`)
      })
      .catch((err) => {
        failed(res, [], err.message)
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  insert: (req, res) => {
    try {
      upload.fields([
        { name: 'image1', maxCount:1 },
        { name: 'image2', maxCount:1 },
        { name: 'image3', maxCount:1 }
      ])(req, res, (err) => {
        if (err) {
          if (err.code === `LIMIT_FIELD_VALUE`) {
            failed(res, [], `Image size is to big`)
          } else {
            failed(res, [], err)
          }
        } else {
          const body = req.body
          body.image1 = req.files.image1 == undefined ? 'doc404.jpg' : req.files.image1[0].filename
          body.image2 = req.files.image2 == undefined ? 'doc404.jpg' : req.files.image2[0].filename
          body.image3 = req.files.image3 == undefined ? 'doc404.jpg' : req.files.image3[0].filename
          // console.log(body)
          portofolioModel.insert(body)
          .then((result)=>{
              success(res, result, `Insert data success`)
          })
          .catch((err)=>{
              failed(res, [], err.message)
          })  
        }
      })
      
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  update: (req, res) => {
    try {
      // const body = req.body
      upload.fields([
        { name: 'image1', maxCount:1 },
        { name: 'image2', maxCount:1 },
        { name: 'image3', maxCount:1 }
      ])(req, res, (err) => {
        if (err) {
          if (err.code === `LIMIT_FIELD_VALUE`) {
            failed(res, [], `Image size is to big`)
          } else {
            failed(res, [], err)
          }
        } else {
          const body = req.body
          const id = req.params.id
          portofolioModel.getdetail(id)
          .then((result) => {
            const imageOld1 = result[0].image1
            const imageOld2 = result[0].image2
            const imageOld3 = result[0].image3
  
            const imageOld = [imageOld1, imageOld2, imageOld3]
            
            body.image1 = !req.files.image1 ? imageOld1 : req.files.image1[0].filename
            body.image2 = !req.files.image2 ? imageOld2 : req.files.image2[0].filename
            body.image3 = !req.files.image3 ? imageOld3 : req.files.image3[0].filename
  
            const imageNew = [body.image1, body.image2, body.image3]
  
            // console.log('lama')
            // console.log(imgOld)
            // console.log('baru')
            // console.log(imgNew)
  
            //bandingin array pisahin yg beda
            const imageArrDel = imageOld.filter(e => imageNew.indexOf(e) === -1)
  
            // console.log('delete')
            // console.log(imgArrDel)
  
            imageArrDel.filter((e) => {
              if (e !== 'doc404.jpg') {
                // console.log(`yg d delete ${e}`)
                fs.unlink(`src/uploads/${e}`, (err) => {
                  console.log('Img Delete Success')
                })
              }
            })
  
            // console.log(body)
            // console.log(id)
  
            portofolioModel.update(body, id)
            .then((result) => {
              success(res, result, `update data with id ${id} success`)
            }).catch((err) => {
              failed(res, [], err.message)
            })
  
          })
          .catch((err) => {
            failed(res, [], err.message)
          })
        }
      })
      
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },

  delete: (req, res) => {
    try {
      const id = req.params.id
      portofolioModel.getdetail(id)
      .then((result) => {
          const dataImage1 = result[0].image1
          const dataImage2 = result[0].image2
          const dataImage3 = result[0].image3 

          const arrImage = [dataImage1, dataImage2, dataImage3]
          const arrImgDel = arrImage.filter((e) => {
            if (e !== 'doc404.jpg') {
              fs.unlink(`src/uploads/${e}`, (err) => {
                    console.log('Img Delete Success')
                  })
            }
          })

          portofolioModel.delete(id)
          .then((result) => {
            success(res, result, `ID ${id} success deleted!`)
          }).catch((err) => {
            failed(res, [], err.message)
          })
      })
      .catch((err) => {
        failed(res, [], err.message)
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  }

}
module.exports = portofolio