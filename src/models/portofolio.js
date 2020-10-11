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
  insert: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO portofolio (
        idpekerja,
        namaaplikasi,
        linkrepository,
        tipeportofolio,
        image1,
        image2,
        image3
      ) VALUES (
        '${data.idpekerja}',
        '${data.namaaplikasi}',
        '${data.linkrepository}',
        '${data.tipeportofolio}',
        '${data.image1}',
        '${data.image2}',
        '${data.image3}'
      )`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  update: (data,id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE portofolio SET ? WHERE idportofolio = ?`, [data, id], (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  },

  delete: (id) => {
    return new Promise ((resolve, reject) => {
      db.query (`DELETE FROM portofolio WHERE idportofolio = ${id}`, (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  }

}

module.exports = portofolio