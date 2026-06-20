const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const User = require('../models/User');
const Internship = require('../models/Internship');

router.get('/companies', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const companies = await User.find({ role: 'company' }).select('-password');
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/companies/:id/verify', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const company = await User.findByIdAndUpdate(
            req.params.id,
            { verified: true },
            { new: true }
        ).select('-password');
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/internships', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const internships = await Internship.find()
            .populate('companyId', 'companyName')
            .sort({ createdAt: -1 });
        res.json(internships);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/internships/:id', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        await Internship.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;