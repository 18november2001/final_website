const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Submission = require('../models/Submission');
const { sendAdminAlert, sendAutoReply } = require('../utils/mailer');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many submissions. Please wait 15 minutes before trying again.' }
});

// POST /api/contact
router.post('/', limiter, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, organisation, service, country, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (message.length < 10) {
      return res.status(400).json({ error: 'Message is too short.' });
    }

    const submission = await Submission.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      organisation: organisation?.trim() || '',
      service: service || 'General Enquiry',
      country: country?.trim() || '',
      message: message.trim(),
      ipAddress: req.ip
    });

    // Fire emails — don't block response
    Promise.all([
      sendAdminAlert(submission),
      sendAutoReply(submission)
    ]).catch(err => console.error('Email error:', err));

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received. We will be in touch within 1–2 business days.'
    });

  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
