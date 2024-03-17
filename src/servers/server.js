const errorHandler = require('./errorHandler/errorHandler');
const { body } = require('express-validator');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/todo';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Use the todoRoutes middleware
app.use('/todos', todoRoutes);
// Error handling middleware
app.use(errorHandler);
