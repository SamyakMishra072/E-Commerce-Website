// backend/models/VerificationToken.js
const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true },
  code:         { type: String, required: true },
  expiresAt:    { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('VerificationToken', verificationSchema);
