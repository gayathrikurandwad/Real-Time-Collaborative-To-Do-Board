const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  smartAssign
} = require('../controllers/taskController');

// Task routes
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/assign-smart', smartAssign);

module.exports = router;
