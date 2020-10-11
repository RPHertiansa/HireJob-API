const portofolioModel = require('../models/portofolio')
const { success, failed } = require('../helpers/response')

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

}
module.exports = portofolio