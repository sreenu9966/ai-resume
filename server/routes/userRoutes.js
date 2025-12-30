const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Sync User from Firebase to MongoDB
// @route   POST /api/users/sync
// @access  Public (Protected by Client ID implicitly, usually we verify Token)
const LoginHistory = require('../models/LoginHistory');

// @desc    Sync User and Log Login
router.post('/sync', async (req, res) => {
    const { uid, email, displayName, photoURL, mobile } = req.body;

    try {
        // Atomic Upsert to prevent race conditions
        const updateData = {
            lastActive: Date.now(),
            lastLogin: Date.now(),
            email,
            displayName,
            photoURL
        };

        if (mobile) updateData.mobile = mobile;

        const user = await User.findOneAndUpdate(
            { uid },
            {
                $set: updateData,
                $setOnInsert: {
                    status: 'active',
                    createdAt: Date.now()
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Check if blocked
        if (user.status === 'blocked') {
            return res.status(403).json({ message: 'Access Denied: Your account has been blocked by Admin.' });
        }

        // Log Login History (Fire and forget, but catch errors)
        try {
            // Check if we already logged this login in the last 5 seconds to avoid spamming logs on double-sync
            const recentLog = await LoginHistory.findOne({
                uid: user.uid,
                loginTime: { $gt: Date.now() - 5000 }
            });

            if (!recentLog) {
                await LoginHistory.create({
                    uid: user.uid,
                    ipAddress: req.ip || req.connection.remoteAddress,
                    device: req.headers['user-agent'],
                    loginTime: Date.now()
                });
            }
        } catch (logError) {
            console.error("Login Log Error:", logError);
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Sync Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Make user admin (Protected by Secret)
// @route   GET /api/users/make-admin/:email?secret=YOUR_SECRET
router.get('/make-admin/:email', async (req, res) => {
    try {
        // const { secret } = req.query;
        // if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
        //     return res.status(403).json({ message: 'Forbidden: Invalid Admin Secret' });
        // }

        const user = await User.findOne({ email: req.params.email });
        if (user) {
            user.role = 'admin';
            await user.save();
            res.json({ message: `User ${user.displayName} is now an Admin`, user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Subscribe to a plan or apply coupon
// @route   POST /api/users/subscribe
router.post('/subscribe', async (req, res) => {
    const { userId, plan, coupon } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let expiryDate = new Date();
        let subType = plan;

        // Special Offer Coupon
        if (coupon === 'RGNEW2026') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 Year Free
            subType = 'offer';
            user.isSubscribed = true;
            user.subscriptionType = subType;
            user.subscriptionExpiry = expiryDate;
            await user.save();
            return res.json({ message: 'Special New Year offer applied! 1 Year Premium active.', user });
        }

        // Standard Plans
        if (plan === 'monthly') {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else if (plan === 'quarterly') {
            expiryDate.setMonth(expiryDate.getMonth() + 3);
        } else if (plan === 'yearly') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        } else {
            return res.status(400).json({ message: 'Invalid plan selected' });
        }

        user.isSubscribed = true;
        user.subscriptionType = subType;
        user.subscriptionExpiry = expiryDate;

        await user.save();
        res.json({ message: `Successfully subscribed to ${plan} plan!`, user });

    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).json({ message: 'Failed to process subscription' });
    }
});

module.exports = router;
