const { body, validationResult } = require('express-validator');
const Todo = require('../models/todoModel');

// Retrieve all todo tasks
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new todo task
router.post('/', 
  // Validation middleware
  body('task').notEmpty().withMessage('Task is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const todo = new Todo({
      task: req.body.task,
      description: req.body.description
    });
    try {
      const newTodo = await todo.save();
      res.status(201).json(newTodo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});


// Modify a todo task
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo task not found' });
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove a todo task
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo task not found' });
    await todo.remove();
    res.json({ message: 'Todo task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

