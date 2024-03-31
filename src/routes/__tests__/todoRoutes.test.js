const request = require('supertest');
const app = require('../../../src/servers/server.js'); // Adjust the path based on your project structure
const mongoose = require('mongoose');
const Todo = require('../../../src/models/todoModel.js'); // Adjust the path based on your project structure
const router = require('../../../src/routes/todoRoutes.js'); // Import the router

// Test suite for todo routes
describe('Todo Routes', () => {
  // Before running any tests, connect to the MongoDB database
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test_todo', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // After running all tests, disconnect from the MongoDB database and close the Express app
  afterAll(async () => {
    await mongoose.connection.close();
    await app.close();
  });

  // Test case for getting all todos
  it('should get all todos', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test case for creating a new todo
  it('should create a new todo', async () => {
    const newTodo = { task: 'Test task', description: 'Test description' };
    const res = await request(app).post('/todos').send(newTodo);
    expect(res.status).toBe(201);
    expect(res.body.task).toBe(newTodo.task);
    expect(res.body.description).toBe(newTodo.description);
  });

  // Test case for updating a todo
  it('should update a todo', async () => {
    // First, create a new todo
    const createdTodo = await Todo.create({ task: 'Test task', description: 'Test description' });
    // Update the todo
    const updatedTodo = { completed: true };
    const res = await request(app).put(`/todos/${createdTodo._id}`).send(updatedTodo);
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  // Test case for deleting a todo
  it('should delete a todo', async () => {
    // First, create a new todo
    const createdTodo = await Todo.create({ task: 'Test task', description: 'Test description' });
    // Delete the todo
    const res = await request(app).delete(`/todos/${createdTodo._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Todo task deleted');
  });
});

