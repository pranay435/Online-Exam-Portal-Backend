const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('../config/db');
const authenticateJs = require('../middleware/authenticateJs');
const secret_key = process.env.secret;

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body

    console.log(username, password)



    const query = 'SELECT * FROM users WHERE username = ?';
    client.query(query, [username], async (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const fetchedPass = result[0].password
        const isPasswordValid = await bcrypt.compare(password, fetchedPass)

        if (!isPasswordValid) {
            return res.status(401).send('Invalid username or passowrd')
        }
        console.log(result)

        //create token and send

        const token = jwt.sign({ username: username }, secret_key, { expiresIn: "1h" })
        console.log(token)
        res.status(200).send({ token, username })
    })

});

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Hash the password and await the result
        const passHash = await bcrypt.hash(password, 10);

        const query = `INSERT INTO users (username, password, email) VALUES(?, ?, ?)`;

        // Execute the query with the hashed password
        client.query(query, [username, passHash, email], (err, result) => {
            if (err) {
                console.error("Database Error:", err.message || err);
                return res.status(500).send("Internal Server Error");
            }

            return res.status(200).send("Successfully Signed Up...");
        });
    }
    catch (error) {
        console.error("Error:", error.message || error);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
