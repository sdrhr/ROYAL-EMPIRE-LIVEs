const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req,res) => {
  try {
    const { username, email, password, referral } = req.body;
    if(!username || !email || !password) return res.json({ success:false, message:'All fields required' });

    let user = await User.findOne({ email });
    if(user) return res.json({ success:false, message:'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashed });
    
    await user.save();

    // Referral logic
    if(referral) {
      let refUser = await User.findById(referral);
      if(refUser){
        refUser.referrals.level1.push(user._id);
        await refUser.save();
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ success:true, token, userId: user._id });
  } catch(err) { console.log(err); res.status(500).send('Server error'); }
});

router.post('/login', async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.json({ success:false, message:'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.json({ success:false, message:'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ success:true, token, userId: user._id });
  } catch(err) { console.log(err); res.status(500).send('Server error'); }
});

module.exports = router;
