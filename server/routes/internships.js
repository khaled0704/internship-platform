const express = require('express');
const router = express.Router();
const { createInternship, getInternships, getInternshipById, updateInternship, deleteInternship } = require('../controllers/internshipController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.get('/', getInternships); // public
router.get('/:id', getInternshipById); // public
router.post('/', verifyToken, requireRole('company'), createInternship);
router.put('/:id', verifyToken, requireRole('company'), updateInternship);
router.delete('/:id', verifyToken, requireRole('company', 'admin'), deleteInternship);

module.exports = router;