const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Read the certificate file
const serverCertPath = path.resolve(__dirname, 'server-cert.pem');
const serverCert = fs.readFileSync(serverCertPath);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: serverCert,
    }
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

module.exports = connection;
