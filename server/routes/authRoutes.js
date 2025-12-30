const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllerNew');

// New Routes from Extra Project Integration
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot', authController.forgotUser);

// Keeping existing password reset routes just in case, but they might not be used by the new UI
// router.post('/forgot-password', ...); // You can restore if needed
// router.post('/reset-password', ...); // You can restore if needed

module.exports = router;
