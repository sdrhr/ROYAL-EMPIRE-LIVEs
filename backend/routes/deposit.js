const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req,file,cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', upload.single('proof'), async (req,res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if(!user) return res.json({ success:false });

    const { method, amount } = req.body;
    if(!amount || !req.file) return res.json({ success:false, message:'Amount and proof required' });

    const trans = new Transaction({
      userId: user._id,
      type: 'deposit',
      method,
      amount,
      proof: req.file.filename
    });
    await trans.save();
    res.json({ success:true });
  } catch(err){ console.log(err); res.status(500).send('Server error'); }
});

module.exports = router;
