const skillModel = require('../models/skill')
const { success, failed } = require('../helpers/response')

const skill = {
  getall: (req, res) => {
    try {
      const id = req.params.id
      skillModel.getall(id)
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
  //     skillModel.getdetail(id)  
  //     .then((result) => {
  //       success(res, result, 'Get skill by id pekerja success')
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
        skillModel.insert(body)
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
      skillModel.update(body, id)
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
      skillModel.delete(id)
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

module.exports = skill