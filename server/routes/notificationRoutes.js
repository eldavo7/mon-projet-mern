// server/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:userId', getNotifications);
router.put('/read-all/:userId', markAllAsRead); // Placée en premier
router.put('/read/:id', markAsRead);           // Placée après

module.exports = router;