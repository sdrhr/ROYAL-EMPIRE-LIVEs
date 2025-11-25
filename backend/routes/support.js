const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/chat', async (req,res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { message } = req.body;
    // Simple AI response (can integrate OpenAI API if you want)
    const reply = `AI Reply: We received your message "${message}". Our team will assist you shortly.`;
    res.json({ reply });
  } catch(err){ console.log(err); res.status(500).send('Server error'); }
});

module.exports = router;
