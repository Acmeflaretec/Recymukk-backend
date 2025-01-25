const { Router } = require('express');
const {
  addNotification,
  editNotification,
  getNotificationById,
  deleteNotification,
  getAllNotifications,
  getClientNotifications
} = require('../controllers/notificationController');

const router = Router();

router.post('/', addNotification); 
router.get('/', getAllNotifications);
router.get('/client', getClientNotifications);
router.get('/', getAllNotifications);
router.patch('/', editNotification); 
router.get('/:id', getNotificationById); 
router.delete('/:id', deleteNotification)

module.exports = router;
