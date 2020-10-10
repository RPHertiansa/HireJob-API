const db = require('../configs/db')

const pengalaman = {
  getall: (id, sort, type) => {
    // console.log(id)
    return new Promise((resolve, reject) => {
      db.query(`SELECT *, 
      (SELECT TIMESTAMPDIFF (MONTH, mulaikerja, selesaikerja)) AS lamakerja
      FROM pengalaman
      WHERE idpekerja = ${id}
      ORDER BY ${sort} ${type}`, (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  },
  insert: (data) => {
    // console.log(data)
    return new Promise ((resolve, reject) => {
      db.query (`INSERT INTO pengalaman (
          idpekerja,
          posisi,
          namaperusahaan,
          mulaikerja,
          selesaikerja,
          deskripsi
        ) 
        VALUES (
        '${data.idpekerja}',
        '${data.posisi}',
        '${data.namaperusahaan}',
        '${data.mulaikerja}',
        '${data.selesaikerja}',
        '${data.deskripsi}'
        )`, (err, result) => {
        if(err){
          reject(new Error(err))
        }else{
          resolve(result)
        }
      })
    })
  },
  update: (data, id) => {
    // console.log(data, id)
    return new Promise ((resolve, reject) => {
      db.query(`UPDATE pengalaman SET ? WHERE idpengalaman = ?`, [data, id], (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  },
  delete: (id) => {
    // console.log(id)
    return new Promise ((resolve, reject) => {
      db.query(`DELETE FROM pengalaman WHERE idpengalaman = ${id}`, (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  }
}

module.exports = pengalaman