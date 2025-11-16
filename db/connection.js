const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "#########",
    database: "#########"
});

connection.connect((err) => {
    if(err) {
        console.log("Database Connection failed: ", err);
    } else {
        console.log("Connected to MySQL database successfully!")
    }
});

module.exports = connection;