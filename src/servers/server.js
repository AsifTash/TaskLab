require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const todoRoutes = require('../routes/todoRoutes');
const errorHandler = require('../errorHandler/errorHandler');
const logger = require('../logger/logger');

const app = express();

const PORT = process.env.PORT || 3000; // Use PORT environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo'; // Use MONGODB_URI environment variable or default value

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

// Middleware
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(logger);

// Route middleware
app.use('/todos', todoRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;

