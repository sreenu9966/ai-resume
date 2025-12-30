const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// @route   POST /api/leads
// @desc    Save a new lead from the welcome popup
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, mobile } = req.body;

        if (!name || !email || !mobile) {
            return res.status(400).json({ message: 'Please provide name, email, and mobile' });
        }

        const newLead = await Lead.create({
            name,
            email,
            mobile
        });

        res.status(201).json({
            message: 'Lead saved successfully',
            lead: newLead
        });
    } catch (error) {
        console.error('Lead Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
