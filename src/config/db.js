const mysql = require("mysql");
require("./env")

const client = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

client.connect((err) => {
    if (err) throw err;
    console.log("Successfully connected to the database...");
});

module.exports = client;
