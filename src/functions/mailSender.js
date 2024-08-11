const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config(); // Ensure this is called before accessing environment variables

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const mailSender = async ({ recepient, subject, text ,html}) => {
    const mailOptions = {
        to: recepient,
        from: process.env.EMAIL,
        subject: subject,
        text: text,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

module.exports = mailSender;
