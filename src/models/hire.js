const db = require('../configs/db');

const hire = {
    getAll : () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM hire`, (err, result) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
}
module.exports = hire