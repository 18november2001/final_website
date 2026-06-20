const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  email:        { type: String, required: true, trim: true, lowercase: true },
  phone:        { type: String, trim: true, default: '' },
  organisation: { type: String, trim: true, default: '' },
  service:      { type: String, trim: true, default: 'General Enquiry' },
  country:      { type: String, trim: true, default: '' },
  message:      { type: String, required: true, trim: true },
  status:       { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
  ipAddress:    { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
