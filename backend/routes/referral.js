const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.get('/', async (req,res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if(!user) return res.json({ success:false });

    // Calculate commissions (example)
    const level1 = user.referrals.level1.length * 1;
    const level2 = user.referrals.level2.length * 2;
    const level3 = user.referrals.level3.length * 3;

    res.json({ level1, level2, level3 });
  } catch(err){ console.log(err); res.status(500).send('Server error'); }
});

module.exports = router;
