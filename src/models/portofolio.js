const db = require('../configs/db')

const portofolio = {
  getall: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT *,
      (SELECT COUNT (*) FROM portofolio WHERE idpekerja = ${id}) AS COUNT
      FROM portofolio
      WHERE idpekerja = ${id}
      `, (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  },
  getdetail: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM portofolio WHERE idportofolio = ${id}`, (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  },

}

module.exports = portofolio