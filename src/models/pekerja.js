const db = require('../configs/db');

const pekerja = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO pekerja SET ?`, data, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  login: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM pekerja WHERE username = '${data.username}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  logout: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE pekerja SET refreshToken = null WHERE iduser='${id}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  updateRefreshToken: (token, id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE pekerja SET refreshToken='${token}' WHERE iduser='${id}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  newPassword: (password, userkey) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE pekerja SET password='${password}' WHERE userkey='${userkey}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  resetKey: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE pekerja SET userkey= null WHERE email='${email}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  updateUserKey: (userKey, email) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE pekerja SET userKey='${userKey}' WHERE email='${email}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  checkRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT *FROM pekerja WHERE refreshToken='${refreshToken}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM pekerja INNER JOIN location ON pekerja.idlocation = location.idlocation`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  getDetail: (iduser) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM pekerja INNER JOIN location ON pekerja.idlocation = location.idlocation WHERE iduser ='${iduser}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  insert: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO pekerja (email, username, password, level, image, address ) VALUES ('${data.email}', '${data.username}', '${data.password}', '${data.level}', '${data.image}', '${data.address}')`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  update: (data, iduser) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE pekerja SET ? WHERE iduser=?`, [data, iduser], (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  delete: (iduser) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM pekerja WHERE iduser = '${iduser}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  getpekerja: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE pekerja SET is_active = 1 WHERE emailpekerja= '${data}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  getEmailpekerja: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM pekerja WHERE email='${email}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          if (result.length > 0) {
            resolve(result)
          } else {
            reject(`Email tidak ditemukan`)
          }
        }
      })
    })
  }
};
module.exports = pekerja