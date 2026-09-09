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

// Marquer une notification spécifique comme lue (par son ID)
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { read: true } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification non trouvée" });
    }
    res.status(200).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Marquer toutes les notifications d'un utilisateur comme lues
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId, read: false }, { $set: { read: true } });
    res.status(200).json({ success: true, message: "Toutes les notifications ont été marquées comme lues" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};