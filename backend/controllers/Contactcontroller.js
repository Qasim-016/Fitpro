const Contact = require('../models/Contact')
// exports.createContact = async (req, res) => {
//   const { username, email, message } = req.body;

//   try {
//     // Validate input
//     if (!username || !email || !message) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Save to database
//     const newContact = new Contact({ username, email, message });
//     await newContact.save();

//     res.status(201).json({ message: 'Contact message submitted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error. Please try again later.' });
//   }
// };


exports.createContact = async (req, res, next) => {
  const { username, email, message } = req.body;

  try {
    // Validate input
    if (!username || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to database
    const newContact = new Contact({ username, email, message });
    await newContact.save();

    res.status(201).json({ message: 'Contact message submitted successfully' });
  } catch (error) {
    next(error);  // Pass error to middleware instead of handling here
  }
};
