exports.createPaymentOrder = async (req, res) => {
  const { amount, currency = 'INR' } = req.body;
  try {
    const options = {
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: `rcpt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ message: 'Could not create payment order' });
  }
};


// backend/controllers/paymentController.js (continued)
exports.verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const crypto = require('crypto');

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    // Payment is genuine
    return res.json({ ok: true });
  }
  res.status(400).json({ ok: false, message: 'Invalid signature' });
};
