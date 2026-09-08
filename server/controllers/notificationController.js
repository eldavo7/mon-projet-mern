// server/controllers/notificationController.js
const Notification = require('../models/Notification');

// Récupérer les notifs d'un utilisateur
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Marquer tout comme lu
exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId, read: false }, { $set: { read: true } });
    res.status(200).json({ success: true, message: "Notifications marquées comme lues" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};