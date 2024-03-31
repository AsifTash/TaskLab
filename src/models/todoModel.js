const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number,
    unique: true
  },
  createdAt: {
    type: String, // Change the type to String
    default: () => new Date().toLocaleString() // Customize the date format
  },
  updatedAt: {
    type: String, // Change the type to String
    default: () => new Date().toLocaleString() // Customize the date format
  }
});

// Auto-incrementing ID logic
todoSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  try {
    const count = await this.constructor.countDocuments();
    this.id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Todo', todoSchema);

