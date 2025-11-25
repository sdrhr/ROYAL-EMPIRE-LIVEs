const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Package = require('../models/Package');

router.post('/buy-package', async (req,res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if(!user) return res.json({ success:false });

    const { amount } = req.body;
    if(amount > user.balance) return res.json({ success:false, message:'Insufficient balance' });

    user.balance -= amount;
    user.totalInvestment += amount;
    await user.save();

    const pkg = new Package({
      userId: user._id,
      name: `Royal Package ${amount}`,
      amount,
      startDate: new Date(),
      endDate: new Date(Date.now() + 45*24*60*60*1000)
    });
    await pkg.save();
    res.json({ success:true });
  } catch(err){ console.log(err); res.status(500).send('Server error'); }
});

module.exports = router;
