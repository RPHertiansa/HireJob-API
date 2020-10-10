const db = require('../configs/db')

const skill = {
  getall: (id, sort, type, limit, offset) => {
    // console.log(id)
    return new Promise((resolve, reject) => {
      db.query(`SELECT *, 
      (SELECT COUNT (*) FROM skill WHERE idpekerja = ${id}) AS count
      FROM skill
      WHERE idpekerja = ${id}
      ORDER BY ${sort} ${type}
      LIMIT ${offset}, ${limit}`, (err, result) => {
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
      db.query (`INSERT INTO skill (
          idpekerja,
          namaskill
        ) 
        VALUES (
        '${data.idpekerja}',
        '${data.namaskill}'
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
      db.query(`UPDATE skill SET ? WHERE idskill = ?`, [data, id], (err, result) => {
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
      db.query(`DELETE FROM skill WHERE idskill = ${id}`, (err, result) => {
        if (err) {
          reject (new Error(err))
        } else {
          resolve (result)
        }
      })
    })
  }
}

module.exports = skill