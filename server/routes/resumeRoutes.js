const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const User = require('../models/User'); // Import User for subscription checks
const DownloadLog = require('../models/DownloadLog'); // Import DownloadLog
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all resumes for the logged-in user
// @route   GET /api/resumes
router.get('/', protect, async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id, isDeleted: { $ne: true } }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get dummy resume data
// @route   GET /api/resumes/dummy-data
router.get('/dummy-data', async (req, res) => {
    const dummyData = {
        personal: {
            fullName: 'Priya Rao',
            email: 'priya.rao@resumegemini.com',
            phone: '+1 (555) 555-555',
            role: 'Software Development Manager',
            summary: 'Highly motivated and result-oriented Software Development Manager with over 10 years of experience in the full software development lifecycle (SDLC). Proven track record of designing and building highly scalable, secure, and performant software systems. Passionate about leading and mentoring high-performing development teams to deliver innovative and high-quality software solutions that consistently exceed business objectives.',
            location: 'Bengaluru, KA, 560001',
            photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500',
        },
        education: [
            {
                id: '1',
                school: 'Rhode Island School of Design',
                degree: 'BFA in Graphic Design',
                year: '2023 - 2024',
                description: 'Graduated Magna Cum Laude. President of the Design & Tech Association.'
            }
        ],
        experience: [
            {
                id: '1',
                company: 'Tech Innovations Labs',
                role: 'Product Manager',
                date: '2024 - Present',
                description: '• Spearheaded the redesign of the core flagship product, resulting in a 25% increase in user retention.\n• Managed a team of 5 designers, establishing a new design system used across 3 interconnected products.\n• Collaborated closely with engineering and product management to define product roadmap and vision.'
            },
            {
                id: '2',
                company: 'Digital Solutions Corp',
                role: 'Senior Developer',
                date: '2021 - 2024',
                description: '• Designed and launched mobile-first interfaces for fintech applications.\n• Conducted user research and usability testing sessions to validate design concepts.\n• Reduced customer support tickets by 15% through intuitive UI improvements.'
            }
        ],
        projects: [
            {
                id: '1',
                name: 'Analytics Dashboard',
                link: '#',
                date: '2023',
                description: 'Complete overhaul of an analytics dashboard for e-commerce merchants. Focused on data visualization and accessibility.'
            },
            {
                id: '2',
                name: 'Fitness Tracking App',
                link: '#',
                date: '2022',
                description: 'Concept to launch design for a fitness tracking application. Featured in "Best of App Design 2022".'
            }
        ],
        achievements: [
            { id: '1', title: "CEO's Choice Award, 2023", description: '' },
            { id: '2', title: 'Excellence in Customer Partnership Award, 2021', description: '' },
            { id: '3', title: 'Growth Mindset Pioneer Award, 2017', description: '' }
        ],
        extras: [
            { id: '1', text: 'English', type: 'languages' },
            { id: '2', text: 'Telugu', type: 'languages' },
            { id: '3', text: 'Hindi', type: 'languages' }
        ],
        extrasTitle: 'Languages',
        skills: [
            'Java', 'Python', 'HTML', 'CSS', 'JavaScript', 'React'
        ]
    };
    res.json(dummyData);
});

// @desc    Get all resumes for a specific user (Admin only or specific check)
// @route   GET /api/resumes/user/:userId
router.get('/user/:userId', protect, async (req, res) => {
    try {
        // Strict Data Isolation: Ensure logged-in user matches the requested userId
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to view these resumes' });
        }

        const resumes = await Resume.find({ userId: req.params.userId, isDeleted: { $ne: true } }).sort({ updatedAt: -1 });
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
        const user = req.user;
        const today = new Date().toISOString().split('T')[0];

        // Subscription Check for Daily Saves
        if (!user.isSubscribed) {
            // Reset count if it's a new day
            if (user.lastSaveDate !== today) {
                user.dailySaveCount = 0;
                user.lastSaveDate = today;
            }

            if (user.dailySaveCount >= 2) {
                return res.status(402).json({
                    message: 'Daily save limit reached. Please upgrade to Pro for unlimited saves.',
                    code: 'LIMIT_REACHED'
                });
            }

            user.dailySaveCount += 1;
            await user.save();
        }

        const resume = await Resume.create({
            userId: user._id,
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

            const user = req.user;
            const today = new Date().toISOString().split('T')[0];

            // Subscription Check for Daily Saves on Update
            if (!user.isSubscribed) {
                if (user.lastSaveDate !== today) {
                    user.dailySaveCount = 0;
                    user.lastSaveDate = today;
                }

                if (user.dailySaveCount >= 2) {
                    return res.status(402).json({
                        message: 'Daily save limit reached. Please upgrade to Pro for unlimited saves.',
                        code: 'LIMIT_REACHED'
                    });
                }

                user.dailySaveCount += 1;
                await user.save();
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

            // Soft Delete
            resume.isDeleted = true;
            resume.deletedAt = new Date();
            await resume.save();
            res.json({ message: 'Resume moved to Trash' });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all trashed resumes for the logged-in user
// @route   GET /api/resumes/trash
router.get('/trash/history', protect, async (req, res) => {
    try {
        const resumes = await Resume.find({
            userId: req.user._id,
            isDeleted: true
        }).sort({ deletedAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Restore a trashed resume
// @route   POST /api/resumes/:id/restore
router.post('/:id/restore', protect, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume) {
            if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            resume.isDeleted = false;
            resume.deletedAt = undefined;
            await resume.save();
            res.json({ message: 'Resume restored successfully', resume });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Permanently delete a resume
// @route   DELETE /api/resumes/:id/permanent
router.delete('/:id/permanent', protect, async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume) {
            if (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            await resume.deleteOne();
            res.json({ message: 'Resume permanently deleted' });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @desc    Log a resume download
// @route   POST /api/resumes/:id/download
router.post('/:id/download', async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(`Download attempt for Resume: ${req.params.id}, User: ${userId}`);

        let userProfile = null;
        if (userId) {
            // 1. Try finding by MongoDB _id (if valid ObjectId)
            if (/^[0-9a-fA-F]{24}$/.test(userId)) {
                userProfile = await User.findById(userId);
            }
            // 2. If not found or not ObjectId, try finding by custom userId field
            if (!userProfile) {
                userProfile = await User.findOne({ userId: userId });
            }
        }

        if (userProfile) {
            const now = new Date();
            const isSubscribed = userProfile.isSubscribed && (!userProfile.subscriptionExpiry || userProfile.subscriptionExpiry > now);

            if (!isSubscribed && userProfile.downloadCount >= 2) {
                console.log(`Limit reached for user: ${userId}`);
                return res.status(402).json({
                    message: 'Monthly download limit reached. Please upgrade to a pro plan to download more resumes.',
                    limitReached: true
                });
            }

            userProfile.downloadCount += 1;
            await userProfile.save();
        }

        await DownloadLog.create({
            uid: userId || 'anonymous',
            resumeId: req.params.id,
            downloadTime: Date.now()
        });

        res.status(200).json({
            message: 'Download logged successfully',
            downloadsRemaining: userProfile && !userProfile.isSubscribed ? Math.max(0, 2 - userProfile.downloadCount) : 'unlimited'
        });
    } catch (error) {
        console.error("CRITICAL: Download log error details:", error);
        res.status(500).json({ message: 'Server error while processing download. Please try again.' });
    }
});

module.exports = router;
