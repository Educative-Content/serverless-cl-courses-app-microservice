const mysql = require('mysql')
const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "Educative123",
database:"Courses" 
})

module.exports = db;