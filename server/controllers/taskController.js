const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const { getIO } = require('../socket');
const User = require('../models/User');

// Smart Assign - assign task to user with fewest active tasks
exports.smartAssign = async (req, res) => {
  try {
    const users = await User.find();
    let minUser = null;
    let minTasks = Infinity;

    for (const user of users) {
      const count = await Task.countDocuments({
        assignedTo: user._id,
        status: { $ne: 'Done' }
      });

      if (count < minTasks) {
        minTasks = count;
        minUser = user;
      }
    }

    if (!minUser) return res.status(404).json({ msg: 'No users available' });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task.assignedTo = minUser._id;
    await task.save();

    const io = getIO();
    io.emit('taskUpdated', task);

    const log = await ActivityLog.create({
      message: `👤 Task '${task.title}' was smart-assigned to ${minUser.name || minUser.email}.`
    });
    io.emit('newLog', log);

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Smart assign failed', error: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const title = req.body.title.trim();
    const lowerTitle = title.toLowerCase();
    const reservedTitles = ['todo', 'in progress', 'done'];

    // Check for reserved title
    if (reservedTitles.includes(lowerTitle)) {
      return res.status(400).json({ msg: 'Invalid title: matches column name' });
    }

    // Check for duplicate title
    const existing = await Task.findOne({ title });
    if (existing) {
      return res.status(400).json({ msg: 'Task title already exists' });
    }

    const task = new Task(req.body);
    const saved = await task.save();

    const io = getIO();
    io.emit('taskCreated', saved);

    const log = await ActivityLog.create({
      message: `🆕 Task '${saved.title}' was created.`
    });

    io.emit('newLog', log);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ msg: 'Failed to create task', error: err.message });
  }
};


// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch tasks', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const current = await Task.findById(req.params.id);
    if (!current) return res.status(404).json({ msg: 'Task not found' });

    // ✅ Check for conflict
    if (
      req.body.lastModified &&
      new Date(req.body.lastModified) < current.lastModified
    ) {
      return res.status(409).json({
        msg: 'Conflict detected',
        currentTask: current,
        yourVersion: req.body
      });
    }

    // ✅ Title validation logic
    const title = req.body.title?.trim();
    const lowerTitle = title?.toLowerCase();
    const reservedTitles = ['todo', 'in progress', 'done'];

    if (reservedTitles.includes(lowerTitle)) {
      return res.status(400).json({ msg: 'Invalid title: matches column name' });
    }

    const duplicate = await Task.findOne({ title });
    if (duplicate && duplicate._id.toString() !== req.params.id) {
      return res.status(400).json({ msg: 'Task title already exists' });
    }

    // ✅ Perform the update
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastModified: new Date()
      },
      { new: true }
    );

    const io = getIO();
    io.emit('taskUpdated', updated);

    const log = await ActivityLog.create({
      message: `✏️ Task '${updated.title}' was moved to '${updated.status}'.`
    });

    io.emit('newLog', log);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ msg: 'Failed to update task', error: err.message });
  }
};



// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    const io = getIO();
    io.emit('taskDeleted', req.params.id);

    const log = await ActivityLog.create({
      message: `🗑️ Task '${deletedTask?.title || 'unknown'}' was deleted.`
    });

    io.emit('newLog', log);
    res.status(200).json({ msg: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ msg: 'Failed to delete task', error: err.message });
  }
};
