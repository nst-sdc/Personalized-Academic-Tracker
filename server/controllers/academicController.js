const Academic = require('../models/Academic');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get academic information for logged-in user
// @route   GET /api/academic
// @access  Private
const getAcademicInfo = async (req, res) => {
    try {
        const academic = await Academic.findByUserId(req.user.id);
        
        if (!academic) {
            return res.status(404).json({
                success: false,
                message: 'Academic information not found'
            });
        }

        res.status(200).json({
            success: true,
            data: academic
        });
    } catch (error) {
        console.error('Get academic info error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred while fetching academic information'
        });
    }
};

// @desc    Create academic information
// @route   POST /api/academic
// @access  Private
const createAcademicInfo = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Check if academic info already exists for this user
        const existingAcademic = await Academic.findByUserId(req.user.id);
        if (existingAcademic) {
            return res.status(400).json({
                success: false,
                message: 'Academic information already exists. Use update instead.'
            });
        }

        // Check if URN already exists
        const existingURN = await Academic.urnExists(req.body.urnNumber);
        if (existingURN) {
            return res.status(400).json({
                success: false,
                message: 'URN/Roll Number already exists'
            });
        }

        // Create academic information
        const academicData = {
            userId: req.user.id,
            instituteName: req.body.instituteName,
            branch: req.body.branch,
            urnNumber: req.body.urnNumber,
            currentYear: parseInt(req.body.currentYear),
            currentSemester: parseInt(req.body.currentSemester),
            gradingSystem: req.body.gradingSystem,
            currentGPA: req.body.currentGPA ? parseFloat(req.body.currentGPA) : undefined,
            totalCredits: req.body.totalCredits ? parseInt(req.body.totalCredits) : undefined,
            expectedGraduationDate: req.body.expectedGraduationDate ? new Date(req.body.expectedGraduationDate) : undefined
        };

        const academic = new Academic(academicData);
        await academic.save();

        res.status(201).json({
            success: true,
            message: 'Academic information created successfully',
            data: academic
        });
    } catch (error) {
        console.error('Create academic info error:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error occurred while creating academic information'
        });
    }
};

// @desc    Update academic information
// @route   PUT /api/academic
// @access  Private
const updateAcademicInfo = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Find existing academic info
        const academic = await Academic.findByUserId(req.user.id);
        if (!academic) {
            return res.status(404).json({
                success: false,
                message: 'Academic information not found'
            });
        }

        // Check URN uniqueness if it's being updated
        if (req.body.urnNumber && req.body.urnNumber !== academic.urnNumber) {
            const existingURN = await Academic.urnExists(req.body.urnNumber, academic._id);
            if (existingURN) {
                return res.status(400).json({
                    success: false,
                    message: 'URN/Roll Number already exists'
                });
            }
        }

        // Update fields
        const updateFields = {
            instituteName: req.body.instituteName || academic.instituteName,
            branch: req.body.branch || academic.branch,
            urnNumber: req.body.urnNumber || academic.urnNumber,
            currentYear: req.body.currentYear ? parseInt(req.body.currentYear) : academic.currentYear,
            currentSemester: req.body.currentSemester ? parseInt(req.body.currentSemester) : academic.currentSemester,
            gradingSystem: req.body.gradingSystem || academic.gradingSystem,
            currentGPA: req.body.currentGPA !== undefined ? parseFloat(req.body.currentGPA) : academic.currentGPA,
            totalCredits: req.body.totalCredits !== undefined ? parseInt(req.body.totalCredits) : academic.totalCredits,
            expectedGraduationDate: req.body.expectedGraduationDate ? new Date(req.body.expectedGraduationDate) : academic.expectedGraduationDate
        };

        const updatedAcademic = await Academic.findByIdAndUpdate(
            academic._id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Academic information updated successfully',
            data: updatedAcademic
        });
    } catch (error) {
        console.error('Update academic info error:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error occurred while updating academic information'
        });
    }
};

// @desc    Delete academic information
// @route   DELETE /api/academic
// @access  Private
const deleteAcademicInfo = async (req, res) => {
    try {
        const academic = await Academic.findByUserId(req.user.id);
        
        if (!academic) {
            return res.status(404).json({
                success: false,
                message: 'Academic information not found'
            });
        }

        await Academic.findByIdAndDelete(academic._id);

        res.status(200).json({
            success: true,
            message: 'Academic information deleted successfully'
        });
    } catch (error) {
        console.error('Delete academic info error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred while deleting academic information'
        });
    }
};

// @desc    Create or update academic information (upsert)
// @route   POST /api/academic/upsert
// @access  Private
const upsertAcademicInfo = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Check if academic info exists
        const existingAcademic = await Academic.findByUserId(req.user.id);
        
        if (existingAcademic) {
            // Update existing
            req.params.id = existingAcademic._id;
            return updateAcademicInfo(req, res);
        } else {
            // Create new
            return createAcademicInfo(req, res);
        }
    } catch (error) {
        console.error('Upsert academic info error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred while processing academic information'
        });
    }
};

// @desc    Get academic statistics (optional - for admin or analytics)
// @route   GET /api/academic/stats
// @access  Private (Admin only)
const getAcademicStats = async (req, res) => {
    try {
        const stats = await Academic.aggregate([
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    averageYear: { $avg: '$currentYear' },
                    averageSemester: { $avg: '$currentSemester' },
                    gradingSystemDistribution: {
                        $push: '$gradingSystem'
                    }
                }
            }
        ]);

        const gradingSystemCount = await Academic.aggregate([
            {
                $group: {
                    _id: '$gradingSystem',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: stats[0] || {},
                gradingSystemDistribution: gradingSystemCount
            }
        });
    } catch (error) {
        console.error('Get academic stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred while fetching academic statistics'
        });
    }
};

module.exports = {
    getAcademicInfo,
    createAcademicInfo,
    updateAcademicInfo,
    deleteAcademicInfo,
    upsertAcademicInfo,
    getAcademicStats
};