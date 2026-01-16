const nodemailer = require('nodemailer')
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.owneremail,
        pass: process.env.pass,
    }
})
exports.sendEmail = async (toEmail, subject, textmsg, htmlpage) => {
    const info = await transporter.sendMail({
        from:process.env.owneremail,
        to: toEmail,
        subject: subject,
        text: textmsg,
        html: htmlpage
    })
    console.log("Email send", info.messageId);
}