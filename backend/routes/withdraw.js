const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

router.post('/', async (req,res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if(!user) return res.json({ success:false });

    const { method, amount } = req.body;
    if(!amount || amount > user.balance) return res.json({ success:false, message:'Invalid amount' });

    user.balance -= amount;
    await user.save();

    const trans = new Transaction({
      userId: user._id,
      type: 'withdraw',
      method,
      amount,
      status:'completed'
    });
    await trans.save();
    res.json({ success:true });
  } catch(err){ console.log(err); res.status(500).send('Server error'); }
});

module.exports = router;
