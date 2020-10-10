const db = require('../configs/db');

const perekrut = {
    register: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO perekrut SET ?`, data, (err, result) => {
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
            db.query(`SELECT * FROM perekrut WHERE emailperekrut = '${data.emailperekrut}'`,  (err, result) => {
                if (err) {
                    reject (new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    logout:(idperekrut) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET refreshToken = null WHERE idperekrut='${idperekrut}'`,
            (err,result)=> {
                if (err) {
                    reject (new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }, 
    updateRefreshToken:(token,idperekrut) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET refreshToken='${token}' WHERE idperekrut='${idperekrut}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    newPassword:(passwordperekrut,userkey) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET passwordperekrut='${passwordperekrut}' WHERE userkey='${userkey}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    resetKey:(emailperekrut) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET userkey= null WHERE emailperekrut='${emailperekrut}'`,
            (err,result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    updateUserKey:(userKey,emailperekrut) => {
        return new Promise((resolve,reject) => {
            db.query(`UPDATE perekrut SET userkey='${userKey}' WHERE emailperekrut='${emailperekrut}'`,
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
            db.query(`SELECT * FROM perekrut`, (err, result) => {
                if (err) {
                    reject (new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getDetail: (idperekrut) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM perekrut WHERE idperekrut ='${idperekrut}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    // insert: (data) => {
    //     return new Promise((resolve, reject) => {
    //         db.query(`INSERT INTO perekrut (email, username, password, level, image, address ) VALUES ('${data.email}', '${data.username}', '${data.password}', '${data.level}', '${data.image}', '${data.address}')`, (err, result) => {
    //             if(err) {
    //                 reject(new Error(err))
    //             } else {
    //                 resolve(result)
    //             }
    //         })
    //     })
    // },
    update: (data, idperekrut) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE perekrut SET ? WHERE idperekrut=?`, [data, idperekrut], (err, result) => {
                if(err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    delete: (idperekrut) => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM perekrut WHERE idperekrut = '${idperekrut}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    activatePerekrut: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE perekrut SET is_active = 1 WHERE emailperekrut = '${data}'`, (err,result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    getEmailPerekrut: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM perekrut WHERE emailperekrut ='${email}'`, (err, result) => {
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