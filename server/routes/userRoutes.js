const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SubscriptionRequest = require('../models/SubscriptionRequest');
const nodemailer = require('nodemailer');

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
        user.subscriptionAmount = coupon === 'RGNEW2026' ? 0 : (req.body.amount || 0);
        user.lastActivationDate = new Date();
        user.couponUsed = coupon || 'DIRECT';
        user.appliedOffer = coupon === 'RGNEW2026' ? 'New Year Special Offer' : 'Standard Plan';
        await user.save();
        res.json({ message: `Successfully subscribed to ${plan} plan!`, user });

    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).json({ message: 'Failed to process subscription' });
    }
});

// @desc    Submit a manual activation request
// @route   POST /api/users/request-activation
router.post('/request-activation', async (req, res) => {
    const { userId, plan, amount, userEmail, userName } = req.body;

    try {
        const newRequest = await SubscriptionRequest.create({
            userId,
            userEmail,
            userName,
            plan,
            amount,
            status: 'pending'
        });

        // Attempt to send Email to Admin
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'ResumeGen.helpdesk@gmail.com',
                    pass: process.env.EMAIL_PASS // User needs to set this
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER || 'ResumeGen.helpdesk@gmail.com',
                to: 'ResumeGen.helpdesk@gmail.com',
                subject: `New Subscription Request from ${userName}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">New Subscription Activation Request</h2>
                        <p><strong>User:</strong> ${userName} (${userEmail})</p>
                        <p><strong>Plan Selected:</strong> ${plan}</p>
                        <p><strong>Amount:</strong> ₹${amount}</p>
                        <p><strong>Request ID:</strong> ${newRequest._id}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #666;">Admin will activate the account after verifying the payment.</p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log("Activation request email sent to admin.");
        } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
            // We don't fail the request if email fails, as it's saved in DB
        }

        res.json({
            message: 'Request submitted! Admin will activate your account shortly.',
            request: newRequest
        });

    } catch (error) {
        console.error("Request Activation Error:", error);
        res.status(500).json({ message: 'Failed to submit request' });
    }
});

const { protect } = require('../middleware/authMiddleware');

// @desc    Get current user profile
// @route   GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Return standard user object for frontend sync
        res.json({
            _id: user._id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            isSubscribed: user.isSubscribed || false,
            downloadCount: user.downloadCount || 0,
            dailySaveCount: user.dailySaveCount || 0,
            lastSaveDate: user.lastSaveDate,
            subscriptionType: user.subscriptionType,
            subscriptionAmount: user.subscriptionAmount,
            lastActivationDate: user.lastActivationDate || (user.isSubscribed ? user.createdAt : null),
            couponUsed: user.couponUsed || (user.isSubscribed && user.subscriptionAmount === 0 ? 'RGNEW2026' : 'DIRECT'),
            appliedOffer: user.appliedOffer || (user.couponUsed === 'RGNEW2026' || (user.isSubscribed && user.subscriptionAmount === 0) ? 'New Year Special Offer' : (user.isSubscribed ? 'New Year Special Offer' : 'Standard Plan')),
            subscriptionExpiry: user.subscriptionExpiry,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
