const pengalamanModel = require('../models/pengalaman')
const { success, failed } = require('../helpers/response')

const pengalaman = {
  getall: (req, res) => {
    try {
      const id = req.params.id
      pengalamanModel.getall(id)
      .then((result) => {
        success(res, result, 'Get data succeess')
      })
      .catch((err) => {
        failed(res, [], err.message)
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },

  // getdetail: (req, res) => {
  //   try {
  //     const id = req.query.idpekerja
  //     pengalamanModel.getdetail(id)  
  //     .then((result) => {
  //       success(res, result, 'Get pengalaman by id pekerja success')
  //     })
  //     .catch((err) => {
  //       failed(res, err, err.message)
  //     })
  //   } 
  //   catch (error) {
  //     failed(res, [], 'Internal Server Error')
  //   }
  // }

  insert: (req, res) => {
    try {
      const body = req.body
        pengalamanModel.insert(body)
        .then((result)=>{
            success(res, result, `Insert data success`)
        })
        .catch((err)=>{
            failed(res, [], err.message)
        })  
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  update: (req, res) => {
    try {
      const id = req.params.id
      const body = req.body
      pengalamanModel.update(body, id)
      .then((result) => [
        success(res, result, 'Update data success')
      ])
      .catch((err) => {
        failed(res, [], err.message)
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  delete: (req, res) => {
    try {
      const id = req.params.id
      pengalamanModel.delete(id)
      .then((result) => {
        success(res, result, 'Delete data success')
      })
      .catch((err) => {
        failed(res, [], err.message)
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  }
}

module.exports = pengalaman