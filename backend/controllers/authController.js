// backend/controllers/authController.js

const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const generateToken = require('../utils/generateToken');

// @desc    Register user (only after email verification)
// @route   POST /api/auth/register
// @access  Public (but requires a prior successful /verify-code)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1) Make sure email is verified: token record should _not_ exist
    const tokenRecord = await VerificationToken.findOne({ email });
    if (tokenRecord) {
      return res
        .status(400)
        .json({ message: 'Email not verified or verification pending.' });
    }

    // 2) Check user doesn't already exist
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // 3) Create the new user
    const user = await User.create({ name, email, password });
    if (!user) {
      return res.status(500).json({ message: 'Failed to create user.' });
    }

    // 4) Return user data + JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // matchPassword defined in User model via bcrypt compare
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }

    res.status(401).json({ message: 'Invalid email or password.' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
