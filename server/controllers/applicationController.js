const Application = require('../models/Application');
const Internship = require('../models/Internship');

exports.applyToInternship = async (req, res) => {
    try {
        const { internshipId, coverNote } = req.body;

        const internship = await Internship.findById(internshipId);
        if (!internship || internship.status === 'closed') {
            return res.status(404).json({ message: 'Internship not found or closed' });
        }

        const application = await Application.create({
            studentId: req.user.id,
            internshipId,
            coverNote,
        });

        res.status(201).json(application);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You already applied to this internship' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ studentId: req.user.id })
            .populate('internshipId', 'title location domain companyId')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getApplicantsForInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }
        if (internship.companyId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ internshipId: req.params.id })
            .populate('studentId', 'name email university fieldOfStudy cvUrl')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const application = await Application.findById(req.params.id)
            .populate('internshipId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.internshipId.companyId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};