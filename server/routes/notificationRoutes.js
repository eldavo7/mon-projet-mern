// server/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/:userId', getNotifications);
router.patch('/read-all/:userId', markAsRead);

module.exports = router;