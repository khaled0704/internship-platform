const express = require('express');
const router = express.Router();
const {
    applyToInternship,
    getMyApplications,
    getApplicantsForInternship,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.post('/', verifyToken, requireRole('student'), applyToInternship);
router.get('/my', verifyToken, requireRole('student'), getMyApplications);
router.get('/internship/:id', verifyToken, requireRole('company'), getApplicantsForInternship);
router.put('/:id', verifyToken, requireRole('company'), updateApplicationStatus);

module.exports = router;