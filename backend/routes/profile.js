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

    res.json({ username:user.username, email:user.email, balance:user.balance });
  } catch(err){ console.log(err); res.status(500).send('Server error'); }
});

module.exports = router;
