const mysql = require("mysql");
const config = require("../config/default");

const option = {
    database: config.database.DATABASE,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    host: config.database.HOST
}

const pool = mysql.createPool(option);

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports = {
    query
}