const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('../config/db');
const authenticateJs = require('../middleware/authenticateJs');
const secret_key = process.env.secret;
const formatTime = require("../functions/formatTime")
const generateQuestions = require("../utils/generateQuestions")
const mailSender = require("../functions/mailSender")
const generateHtmlContent = require("../utils/generateHTMLContent")


const router = express.Router();

router.get('/test', authenticateJs, (req, res) => {

    const subjects = ['dbms_questions', 'sql_questions', 'oop_questions', 'os_questions', 'computer_networks_questions'];

    const subject = req.query.subject;
    const table_name = subjects[subject];

    if (!table_name) {
        return res.status(400).send('Invalid Subject');
    }

    const ids = generateQuestions(30, 1, 200);
    const placeholders = ids.map(() => '?').join(', ');
    const query = `SELECT * FROM ${table_name} WHERE id IN (${placeholders})`;

    client.query(query, ids, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error querying the database');
        }

        const shuffledResults = result.map((question, index) => {
            const options = [
                question.option_a,
                question.option_b,
                question.option_c,
                question.option_d
            ];

            const correct_answer = question.option_a;

            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }

            return {
                id: index + 1,
                question: question.question,
                options: options,
                correct_answer: correct_answer
            };
        });

        res.status(200).json(shuffledResults);
    });
    
});

router.post('/postResults', authenticateJs, async (req, res) => {
    const { user, score, currentTimeStamp, subject, mailResults } = req.body;

    try {
        // Retrieve the user's email
        const gmailQuery = 'SELECT * FROM users WHERE username = ?';
        const [userResult] = await new Promise((resolve, reject) => {
            client.query(gmailQuery, [user], (err, result) => {
                if (err) {
                    console.error('Error querying user:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (!userResult || userResult.length === 0) {
            console.error('User not found');
            return res.status(404).send('User not found');
        }

        const gmail = userResult.email;
        console.log('Retrieved user email:', gmail);

        const grade = score >= 12 ? 'pass' : 'fail';
        const testTime = formatTime(new Date());
        console.log('Formatted test time:', testTime);

        // Insert the results into the database
        const insertQuery = 'INSERT INTO results (username, test_time, marks, grade, gmail, subject) VALUES (?, ?, ?, ?, ?, ?)';
        await new Promise((resolve, reject) => {
            client.query(insertQuery, [user, testTime, score, grade, gmail, subject], (err, result) => {
                if (err) {
                    console.error('Error inserting results:', err);
                    reject(err);
                } else {
                    resolve(result);

                    if (mailResults) {
                        const mailSubject = `Your ${subject} results of ${testTime} are out...`;
                        const htmlContent = generateHtmlContent(score, grade, testTime, subject);
                        const textContent = `Marks Scored: ${score}\nGrade: ${grade}`;

                        console.log("Sending email to:", gmail);
                        
                        mailSender({ 
                            recepient: gmail, 
                            subject: mailSubject,
                            text: textContent, // Optional: Text version of the email
                            html: htmlContent 
                        });
                    }
                }
            });
        });

        res.status(200).send('Results posted successfully');
        console.log('Response sent:', res);

    } catch (error) {
        console.error('Internal Server Error:', error);
     
        res.status(500).send('Internal Server Error');
    }
});

router.get('/results', authenticateJs, async (req, res) => {
    const user = req.query.user
    const query = 'SELECT * FROM results WHERE username = ? ORDER BY test_time DESC;'
    try {
        client.query(query, [user], ((err, result) => {
            if (err) {
                return res.status(500).send("Internal Server Error...")
            }
            console.log(result)
            res.status(200).send(result)
        }))
    }
    catch (error) {
        console.log(error)
    }

});

module.exports = router;
