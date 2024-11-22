const express = require('express');
const User = require('./models/User'); // Assuming you have a User schema
const router = express.Router();

router.post('/check-user', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
