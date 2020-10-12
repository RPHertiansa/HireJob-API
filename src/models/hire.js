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
            db.query(`SELECT idhire, pesantujuan, hire.deskripsi, perekrut.idperekrut,  namaperekrut, emailperekrut, phoneperekrut, namaperusahaan, imageperekrut, pekerja.idpekerja, namapekerja, emailpekerja, phonepekerja, domisilipekerja, imagepekerja 
            FROM hire 
            INNER JOIN pekerja ON hire.idpekerja = pekerja.idpekerja
            INNER JOIN perekrut ON hire.idperekrut = perekrut.idperekrut`, (err, result) => {
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
            db.query(`SELECT idhire, pesantujuan, hire.deskripsi, perekrut.idperekrut,  namaperekrut, emailperekrut, phoneperekrut, namaperusahaan, imageperekrut, pekerja.idpekerja, namapekerja, emailpekerja, phonepekerja, domisilipekerja, imagepekerja 
            FROM hire 
            INNER JOIN pekerja ON hire.idpekerja = pekerja.idpekerja
            INNER JOIN perekrut ON hire.idperekrut = perekrut.idperekrut WHERE idhire = ${idhire}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    cariPekerja : (idperekrut) => {
        return new Promise ((resolve, reject) => {
            db.query(`SELECT pekerja.idpekerja, namapekerja, emailpekerja, phonepekerja, domisilipekerja, imagepekerja FROM hire INNER JOIN pekerja ON hire.idpekerja = pekerja.idpekerja WHERE hire.idperekrut=${idperekrut}`, (err, result) => {
                if(err) {
                    reject (new Error(err))
                } else {
                    resolve (result)
                }
            })
        })
    },
    cariPerekrut : (idpekerja) => {
        return new Promise ((resolve, reject) => {
            db.query(`SELECT perekrut.idperekrut, namaperekrut, emailperekrut, phoneperekrut, namaperusahaan, imageperekrut FROM hire INNER JOIN perekrut ON hire.idperekrut = perekrut.idperekrut WHERE hire.idpekerja=${idpekerja}` ,(err, result) => {
                if(err) {
                    reject (new Error(err))
                } resolve (result)
            })
        })
    }
}
module.exports = hire