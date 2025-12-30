const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176'
        ];
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow if FRONTEND_URL is set to * (Wildcard)
        if (process.env.FRONTEND_URL === '*') return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin); // Log the blocked origin for debugging
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

const PORT = process.env.PORT || 5004;

// Start Server
const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        // Only after connection is successful, try to perform DB operations
        const User = require('./models/User');
        try {
            const indexes = await User.collection.indexes();
            const uidIndex = indexes.find(idx => idx.key && idx.key.uid !== undefined);
            if (uidIndex) {
                const indexName = uidIndex.name || 'uid_1';
                await User.collection.dropIndex(indexName);
                console.log('Dropped legacy uid index');
            }
        } catch (err) {
            // If checking indexes fails, just log it but don't crash, 
            // unless it's a critical DB error which connectDB likely caught.
            console.log('Note: Could not check/drop legacy indexes (this is expected on new DBs or connection issues):', err.message);
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
