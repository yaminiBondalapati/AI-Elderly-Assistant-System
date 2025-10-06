// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const GEMINI_API_KEY = 'AIzaSyB44z8XoeRrCMhRd7P6DOBlfq1iMxhTq3Q';

// Load environment variables
dotenv.config();

// Import reminder job
const { startReminderJob, stopReminderJob } = require('./utils/reminderService');

// Initialize Express app
const app = express();

// Set PORT
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP for dev if needed
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-frontend-domain.com'
    : 'http://localhost:3005', // Adjust to your frontend URL
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/reports', require('./routes/medicalRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/chat-history', require('./routes/chatHistoryRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health Check & Homepage
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
      <h1>✅ Elderly Assistant API Running</h1>
      <p>Server is live on port <strong>${PORT}</strong></p>
      <p>Environment: <strong>${process.env.NODE_ENV || 'development'}</strong></p>
      <hr>
      <small>Powered by Node.js + Express + MongoDB</small>
    </div>
  `);
});

// Database Connection & Server Start
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri || typeof mongoUri !== 'string') {
  console.error('❌ MongoDB URI is missing or invalid. Please set MONGO_URI in your .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');

    // Start the Express server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📅 Started on: ${new Date().toLocaleString()}`);
      // Start background reminder job
      startReminderJob();
    });

    // Optional: Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down gracefully...');
      stopReminderJob();
      server.close(() => {
        console.log('❌ Express server closed');
        mongoose.connection.close().then(() => {
          console.log('🔌 MongoDB connection closed');
          process.exit(0);
        });
      });
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:');
    console.error(err.message);
    process.exit(1); // Exit process with failure
  });