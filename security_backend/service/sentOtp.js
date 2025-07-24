const nodemailer = require("nodemailer");
 
const sendOtp = async (email, otp) => {
  // Configure the transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
 
  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: email, // Recipient address
    subject: "SparkleNest Password Reset Verification Code", // Subject line
    text: `Hello,\n\nYou requested a password reset for your SparkleNest account.\n\nYour One-Time Password (OTP) is: ${otp}\n\nPlease enter this code in the app to continue. This code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\nThank you,\nSparkleNest Team`, // Plain text body
    html: `<div style='font-family: Arial, sans-serif; font-size: 16px; color: #222;'>
 
  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return true; // Return true if email sent successfully
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false; // Return false if there's an error
  };
  }
};
 
module.exports = sendOtp;
 