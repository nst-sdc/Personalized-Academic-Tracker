const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const { protect } = require('../middleware/JWTauthentication');

// Add a new grade
router.post('/', protect, async (req, res) => {
  try {
    const grade = await Grade.create({ ...req.body, userId: req.user._id });
    res.status(201).json(grade);
  } catch (err) {
    res.status(500).json({ message: 'Error adding grade', error: err.message });
  }
});

// Get all grades for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const grades = await Grade.find({ userId: req.user._id });
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching grades', error: err.message });
  }
});

// Update a grade
router.put('/:id', protect, async (req, res) => {
    try {
      const grade = await Grade.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true }
      );
      if (!grade) {
        return res.status(404).json({ message: 'Grade not found' });
      }
      res.status(200).json(grade);
    } catch (err) {
      res.status(500).json({ message: 'Error updating grade', error: err.message });
    }
  });
  
  // Delete a grade
  router.delete('/:id', protect, async (req, res) => {
    try {
      const grade = await Grade.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
      if (!grade) {
        return res.status(404).json({ message: 'Grade not found' });
      }
      res.status(200).json({ message: 'Grade deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting grade', error: err.message });
    }
  });

module.exports = router;
