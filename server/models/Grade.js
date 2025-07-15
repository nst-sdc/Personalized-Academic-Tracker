const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semester: String,
  date: Date,
  courseName: String,
  assignmentTitle: String,
  marks: Number,
  maxMarks: Number,
  expectedGrade: String,
  finalGrade: String,
  credits: Number
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
