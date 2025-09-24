import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Fasih App 👋" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'رمز التحقق من البريد الإلكتروني',
    html: `
      <div style="font-family: 'Tahoma'; text-align: right; direction: rtl;">
        <h2>مرحباً بك في فصيح!</h2>
        <p>رمز التحقق الخاص بك هو:</p>
        <h3 style="color: #a0522d;">${otp}</h3>
        <p>صالح لمدة 10 دقائق فقط.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};