require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // Import rate limiting middleware
const todoRoutes = require('../routes/todoRoutes');
const errorHandler = require('../errorHandler/errorHandler');
const logger = require('../logger/logger');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(logger);

// Define a route handler for the root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Todo API');
});

// Route middleware
app.use('/todos', todoRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;

