const express = require('express');
const { getProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User'); // ✅ Add this line

const router = express.Router();

// @route   GET /api/profile
router.get('/', protect, getProfile);

// @route   PUT /api/profile
router.put('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
