const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Submission = require('../models/Submission');

// GET /api/submissions — all submissions (protected)
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [submissions, total, newCount] = await Promise.all([
      Submission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Submission.countDocuments(filter),
      Submission.countDocuments({ status: 'new' })
    ]);

    res.json({ submissions, total, newCount, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/submissions/:id — update status (protected)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'responded'].includes(status))
      return res.status(400).json({ error: 'Invalid status.' });

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!submission) return res.status(404).json({ error: 'Not found.' });

    res.json({ submission });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/submissions/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
