const Internship = require('../models/Internship');

exports.createInternship = async (req, res) => {
    try {
        const { title, description, domain, location, duration, remote, paid, salary } = req.body;

        const internship = await Internship.create({
            title,
            description,
            domain,
            location,
            duration,
            remote,
            paid,
            salary,
            companyId: req.user.id, // comes from verifyToken middleware
        });

        res.status(201).json(internship);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getInternships = async (req, res) => {
    try {
        const { domain, remote, paid, location } = req.query;

        const filter = { status: 'open' };
        if (domain) filter.domain = domain;
        if (remote !== undefined) filter.remote = remote === 'true';
        if (paid !== undefined) filter.paid = paid === 'true';
        if (location) filter.location = new RegExp(location, 'i'); // case-insensitive search

        const internships = await Internship.find(filter)
            .populate('companyId', 'companyName sector') // pulls company name from User collection
            .sort({ createdAt: -1 }); // newest first

        res.json(internships);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getInternshipById = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id)
            .populate('companyId', 'companyName sector');

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        res.json(internship);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Make sure the company editing this is the one who posted it
        if (internship.companyId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updated = await Internship.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // returns the updated document, not the old one
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Allow if admin, or if it's the company that posted it
        if (req.user.role !== 'admin' && internship.companyId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await internship.deleteOne();
        res.json({ message: 'Internship deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};