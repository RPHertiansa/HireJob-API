const db = require('../configs/db');

const hire = {
    jobOffer : (data) => {
        return new Promise ((resolve, reject) => {
            db.query(`INSERT INTO hire SET ?`, data, (err, result) => {
                if(err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getAll : () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM hire INNER JOIN perekrut ON hire.idperekrut = perekrut.idperekrut INNER JOIN pekerja ON hire.idpekerja = pekerja.idpekerja`, (err, result) => {
                if(err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getDetail : (idhire) => {
        return new Promise ((resolve,reject) => {
            db.query(`SELECT * FROM hire WHERE idhire = ${idhire}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }
}
module.exports = hire