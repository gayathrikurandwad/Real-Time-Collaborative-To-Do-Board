const ActivityLog = require('../models/ActivityLog');

exports.getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 }) // latest first
      .limit(20);
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch logs', error: err.message });
  }
};
