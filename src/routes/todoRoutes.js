const express = require('express');
const router = express.Router();
const Todo = require('../models/todoModel.js');

// Route to retrieve all todo tasks
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new todo task
router.post('/', async (req, res) => {
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

// Route to update a todo task (PUT method)
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!todo) return res.status(404).json({ message: 'Todo task not found' });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update a todo task (PATCH method)
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!todo) return res.status(404).json({ message: 'Todo task not found' });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a todo task
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ id: req.params.id });
    if (!todo) return res.status(404).json({ message: 'Todo task not found' });

    // Update the sequential ID after deletion
    await Todo.updateMany({ id: { $gt: todo.id } }, { $inc: { id: -1 } });

    res.json({ message: 'Todo task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

