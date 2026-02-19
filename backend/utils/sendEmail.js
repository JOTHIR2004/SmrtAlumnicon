// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: true,
//   auth: {
//     user: "cloudcomputing4002@gmail.com",
//     pass: "pqtnugteqdrprkdg"
//   }
// });

// transporter.verify((error) => {
//   if (error) {
//     console.log(" SMTP error:", error);
//   } else {
//     console.log("SMTP ready");
//   }
// });

// const sendEmail = async (email, otp) => {
//   await transporter.sendMail({
//     from: `"TCE Alumni Connect" <cloudcomputing4002@gmail.com>`,
//     to: email,
//     subject: "Email Verification",
//     text: `Your verification code is ${otp}. Valid for 5 minutes.`,
//     priority:"high"
//   });
// };

// module.exports = sendEmail;
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, otp) => {
  const msg = {
    to: email,
    from: "cloudcomputing4002@gmail.com", // must verify this in SendGrid
    subject: "Email Verification",
    text: `Your verification code is ${otp}. Valid for 5 minutes.`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message);
  }
};

module.exports = sendEmail;

