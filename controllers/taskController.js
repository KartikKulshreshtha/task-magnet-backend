const Task = require('../models/Task');

module.exports.addTask = async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            createdBy: req.user._id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const tasks = await Task.find({
            $or: [
                { assignedTo: req.user._id },
                { createdBy: req.user._id }
            ]
        })
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Task.countDocuments({
            $or: [
                { assignedTo: req.user._id },
                { createdBy: req.user._id }
            ]
        });

        res.json({
            tasks,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        ).populate('assignedTo', 'name email');
        if (!task) throw new Error('Task not found');
        res.json(task);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

module.exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) throw new Error('Task not found');
        res.json({ message: 'Task deleted successfully' });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

module.exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
          .populate('assignedTo', 'name email');
        if (!task) throw new Error('Task not found');
        res.json(task);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}