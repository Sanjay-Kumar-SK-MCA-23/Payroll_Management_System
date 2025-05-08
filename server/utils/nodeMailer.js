const nodemailer = require("nodemailer");
const path = require("path");
const dotEnv = require("dotenv").config();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

async function sendEmail(to, subject, text, attachment = null) {
  let attachmentFilename = null;
  if (attachment) {
    // Extract filename from the full path
    attachmentFilename = path.basename(attachment);
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: text,
    attachments: attachment ? [{ filename: attachmentFilename, path: attachment }] : [], // Include attachment if provided
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      return info;
    })
    .catch((error) => {
      throw error;
    });
}

module.exports = { sendEmail };
