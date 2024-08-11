const generateHtmlContent = (score, grade, testTime, subject) => {
    return `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    font-size: 16px;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Your ${subject} Test Results</h1>
                <p>Test Date: ${testTime}</p>
                <p>Marks Scored: <strong>${score}</strong></p>
                <p>Grade: <strong>${grade}</strong></p>
                <div class="footer">
                    <p>Thank you for taking the test!</p>
                    <p>If you have any questions, please contact us at support@example.com.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};


module.exports = generateHtmlContent