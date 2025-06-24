// backend/controllers/verificationController.js
const crypto = require('crypto');
const VerificationToken = require('../models/VerificationToken');
const transporter = require('../config/mailer');

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Upsert token
  await VerificationToken.findOneAndUpdate(
    { email },
    { code, expiresAt },
    { upsert: true, new: true }
  );

  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your Samyak-Ecom Verification Code',
    text: `Your verification code is ${code}. It expires in 10 minutes.`
  });

  res.json({ message: 'Verification code sent' });
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const record = await VerificationToken.findOne({ email });

  if (!record || record.expiresAt < new Date() || record.code !== code) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }

  // Code valid → delete it
  await record.deleteOne();

  res.json({ message: 'Code verified' });
};
