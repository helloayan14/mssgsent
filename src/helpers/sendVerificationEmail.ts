


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
   service: "gmail",

  auth: {
    user: process.env.GMAIL_USER, // Brevo SMTP Username
    pass: process.env.GMAIL_PASS, // Brevo SMTP Password
  },
 
 
});     

export const sendVerificationEmail = async (email: string, username: string, otp:string) => {
  try {
    await transporter.sendMail({
      from: `"Mssgsent" <${process.env.GMAIL_USER}>`, // Use your Brevo email
      to: email,
      subject: "Your Verification Code",
      html: `<p>Hello ${username},</p><p>Your verification code is: <b>${otp}</b></p>`,
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, message: "Failed to send verification email" };
  }
};

