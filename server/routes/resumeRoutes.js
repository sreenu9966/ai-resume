const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const User = require('../models/User'); // Import User for subscription checks
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all resumes for the logged-in user
// @route   GET /api/resumes
router.get('/', protect, async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all resumes for a specific user (Admin only or specific check)
// @route   GET /api/resumes/user/:userId
router.get('/user/:userId', protect, async (req, res) => {
    try {
        // Strict Data Isolation: Ensure logged-in user matches the requested userId
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to view these resumes' });
        }

        const resumes = await Resume.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single resume
// @route   GET /api/resumes/:id
router.get('/:id', async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume) {
            res.json(resume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a resume
// @route   POST /api/resumes
// @desc    Create a resume
// @route   POST /api/resumes
router.post('/', protect, async (req, res) => {
    const { title, data } = req.body;
    try {
        const resume = await Resume.create({
            userId: req.user._id, // Strict Data Isolation: Force assignment to logged-in user
            title,
            data
        });
        res.status(201).json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @desc    Update a resume
// @route   PUT /api/resumes/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume) {
            // Check ownership
            // Allow update if owner matches OR if resume is currently owned by 'guest-user' (Claiming flow)
            if (resume.userId.toString() !== req.user._id.toString() && resume.userId !== 'guest-user' && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to update this resume' });
            }

            // If it was a guest resume, transfer ownership to the current user
            if (resume.userId === 'guest-user') {
                resume.userId = req.user._id;
            }

            resume.title = req.body.title || resume.title;
            resume.data = req.body.data || resume.data;
            const updatedResume = await resume.save();
            res.json(updatedResume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume) {
            // Check ownership
            if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to delete this resume' });
            }

            await resume.deleteOne();
            res.json({ message: 'Resume removed' });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const DownloadLog = require('../models/DownloadLog');

// @desc    Log a resume download
// @route   POST /api/resumes/:id/download
router.post('/:id/download', async (req, res) => {
    try {
        const { userId } = req.body; // user._id from frontend

        let userProfile = null;
        if (userId && userId !== 'anonymous' && userId !== 'guest') {
            userProfile = await User.findById(userId);
        }

        // If user is logged in, check limits
        if (userProfile) {
            // Check if subscription is expired
            const now = new Date();
            const isSubscribed = userProfile.isSubscribed && (!userProfile.subscriptionExpiry || userProfile.subscriptionExpiry > now);

            // Limit: 2 free downloads if not subscribed
            if (!isSubscribed && userProfile.downloadCount >= 2) {
                return res.status(402).json({
                    message: 'Monthly download limit reached. Please upgrade to a pro plan to download more resumes.',
                    limitReached: true
                });
            }

            // Increment download count for the user
            userProfile.downloadCount += 1;
            await userProfile.save();
        }

        // Log Download (PRD Req)
        await DownloadLog.create({
            uid: userId || 'anonymous',
            resumeId: req.params.id,
            downloadTime: Date.now()
        });

        res.status(200).json({
            message: 'Download logged successfully',
            downloadsRemaining: userProfile && !userProfile.isSubscribed ? 2 - userProfile.downloadCount : 'unlimited'
        });
    } catch (error) {
        console.error("Download log error:", error);
        res.status(500).json({ message: 'Log failed' });
    }
});

module.exports = router;
