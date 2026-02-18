const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: "cloudcomputing4002@gmail.com",
    pass: "pqtnugteqdrprkdg"
  }
});

transporter.verify((error) => {
  if (error) {
    console.log(" SMTP error:", error);
  } else {
    console.log("SMTP ready");
  }
});

const sendEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"TCE Alumni Connect" <cloudcomputing4002@gmail.com>`,
    to: email,
    subject: "Email Verification",
    text: `Your verification code is ${otp}. Valid for 5 minutes.`,
    priority:"high"
  });
};

module.exports = sendEmail;
