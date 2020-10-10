const db = require('../configs/db');

const perekrut = {
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
            db.query(`SELECT * FROM perekrut WHERE username = '${data.username}'`,  (err, result) => {
                if (err) {
                    reject (new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    logout:(id) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET refreshToken = null WHERE iduser='${id}'`,
            (err,result)=> {
                if (err) {
                    reject (new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }, 
    updateRefreshToken:(token,id) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET refreshToken='${token}' WHERE iduser='${id}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    newPassword:(password,userkey) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET password='${password}' WHERE userkey='${userkey}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    resetKey:(email) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET userkey= null WHERE email='${email}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    updateUserKey:(userKey,email) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET userKey='${userKey}' WHERE email='${email}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    checkRefreshToken: (refreshToken) => {
        return new Promise((resolve,reject)=>{
            db.query(`SELECT *FROM perekrut WHERE refreshToken='${refreshToken}'`, 
            (err,result) =>{
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })  
    },
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM perekrut INNER JOIN location ON perekrut.idlocation = location.idlocation`, (err, result) => {
                if (err) {
                    reject (new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getDetail: (iduser) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM perekrut INNER JOIN location ON perekrut.idlocation = location.idlocation WHERE iduser ='${iduser}'`, (err, result) => {
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
            db.query(`INSERT INTO perekrut (email, username, password, level, image, address ) VALUES ('${data.email}', '${data.username}', '${data.password}', '${data.level}', '${data.image}', '${data.address}')`, (err, result) => {
                if(err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    update: (data, iduser) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE perekrut SET ? WHERE iduser=?`, [data, iduser], (err, result) => {
                if(err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    delete: (iduser) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM perekrut WHERE iduser = '${iduser}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getperekrut: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE perekrut SET active = 1 WHERE email= '${data}'`, (err,result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    getEmailperekrut: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT *FROM perekrut WHERE email='${email}'`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    if(result.length > 0){
                        resolve(result)
                    }else{
                        reject(`Email tidak ditemukan`)
                    }
                }
            })
        })
    }
};
module.exports = perekrut