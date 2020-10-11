const hireModel = require('../models/hire')
const perekrutModel = require('../models/perekrut')
const pekerjaModel = require('../models/pekerja')
const { success, failed } = require('../helpers/response')


const hire = {
    jobOffer: (req, res) => {
        try {
            const body = req.body
            
            hireModel.jobOffer(body)
            .then((result) => {
                success(res, result, 'Job offer sent')
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