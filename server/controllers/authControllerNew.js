const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // 1. Basic Content Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Email Regex Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // 3. Password Strength (Minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // 4. Check Username Existence
        const usernameExists = await User.findOne({ name: username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // 5. Check Email Existence
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = 'user_' + Date.now() + Math.floor(Math.random() * 1000);

        const newUser = new User({
            userId,
            name: username, // Mapping username to name
            email,
            password: hashedPassword,
            role: 'user'
        });

        await newUser.save();
        res.status(201).json({
            message: "Signup successful",
            token: generateToken(newUser._id),
            user: {
                _id: newUser._id,
                userId: newUser.userId,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: identifier }, { name: identifier }]
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({ message: "Account is blocked" });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.json({
            message: "Login success",
            token: generateToken(user._id),
            user: {
                _id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const forgotUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No account found" });

        res.json({ username: user.name });
    } catch (error) {
        console.error("Forgot user error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { signup, login, forgotUser };
