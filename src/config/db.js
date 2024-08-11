const mysql = require("mysql");

const client = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "sams3pi0l",
    password: "3lli0t",
    database: "online_exam_portal"
});

client.connect((err) => {
    if (err) throw err;
    console.log("Successfully connected to the database...");
});

module.exports = client;
