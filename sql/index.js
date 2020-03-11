const sql = {
    conditionsSql: "SELECT * from user WHERE ??=? limit 1",
    insertSql: "INSERT INTO user (email,name,password) VALUES (?,?,?)"
};

module.exports = sql;