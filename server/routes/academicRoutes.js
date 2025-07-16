const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getAcademicInfo,
  createAcademicInfo,
  updateAcademicInfo,
  deleteAcademicInfo,
  upsertAcademicInfo,
  getAcademicStats
} = require('../controllers/academicController');

const { protect, authorize } = require('../middleware/JWTauthentication'); // ✅ updated

// Validation rules
const academicValidationRules = [
  body('instituteName')
    .trim()
    .notEmpty()
    .withMessage('Institute name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Institute name must be between 3 and 100 characters'),

  body('branch')
    .trim()
    .notEmpty()
    .withMessage('Branch/Department is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Branch must be between 3 and 100 characters'),

  body('urnNumber')
    .trim()
    .notEmpty()
    .withMessage('URN/Roll Number is required')
    .isLength({ min: 5, max: 30 })
    .withMessage('URN must be between 5 and 30 characters')
    .custom((value) => {
      const urnPattern = /^[A-Za-z0-9-]+$/;
      if (!urnPattern.test(value)) {
        throw new Error('URN can only contain letters, numbers, and hyphens');
      }
      return true;
    }),  

  body('currentYear')
    .isInt({ min: 1, max: 4 })
    .withMessage('Current year must be between 1 and 4'),

  body('currentSemester')
    .isInt({ min: 1, max: 8 })
    .withMessage('Current semester must be between 1 and 8'),

  body('gradingSystem')
    .isIn(['cgpa', 'gpa', 'percentage'])
    .withMessage('Grading system must be either cgpa, gpa, or percentage'),

  body('currentGPA')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Current GPA must be between 0 and 10'),

  body('totalCredits')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total credits must be a positive integer'),

  body('expectedGraduationDate')
    .optional()
    .isISO8601()
    .withMessage('Expected graduation date must be a valid date')
];

// Update validation rules
const academicUpdateValidationRules = [
  body('instituteName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Institute name cannot be empty')
    .isLength({ min: 3, max: 100 })
    .withMessage('Institute name must be between 3 and 100 characters'),

  body('branch')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Branch/Department cannot be empty')
    .isLength({ min: 3, max: 100 })
    .withMessage('Branch must be between 3 and 100 characters'),

  body('urnNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('URN/Roll Number cannot be empty')
    .isLength({ min: 5, max: 30 })
    .withMessage('URN must be between 5 and 30 characters')
    .custom((value) => {
      const urnPattern = /^[A-Za-z0-9-]+$/;
      if (!urnPattern.test(value)) {
        throw new Error('URN can only contain letters, numbers, and hyphens');
      }
      return true;
    }),  

  body('currentYear')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Current year must be between 1 and 4'),

  body('currentSemester')
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage('Current semester must be between 1 and 8'),

  body('gradingSystem')
    .optional()
    .isIn(['cgpa', 'gpa', 'percentage'])
    .withMessage('Grading system must be either cgpa, gpa, or percentage'),

  body('currentGPA')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Current GPA must be between 0 and 10'),

  body('totalCredits')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total credits must be a positive integer'),

  body('expectedGraduationDate')
    .optional()
    .isISO8601()
    .withMessage('Expected graduation date must be a valid date')
];

// Routes
router.get('/', protect, getAcademicInfo);
router.post('/', protect, academicValidationRules, createAcademicInfo);
router.put('/', protect, academicUpdateValidationRules, updateAcademicInfo);
router.delete('/', protect, deleteAcademicInfo);
router.post('/upsert', protect, academicValidationRules, upsertAcademicInfo);

// ✅ Admin-only stats route
router.get('/stats', protect, authorize('admin'), getAcademicStats);

module.exports = router;