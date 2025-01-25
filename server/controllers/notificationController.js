const Notification = require('../models/notificationModel');

exports.addNotification = async (req, res) => {
  try {
    const { notification, status } = req.body;
    console.log('notification, status',notification, status);
    

    if (!notification) {
      return res.status(400).json({ message: 'Notification content is required' });
    }

    const newNotification = new Notification({ notification, status });
    await newNotification.save();

    res.status(201).json({
      message: 'Notification added successfully',
      data: newNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.editNotification = async (req, res) => {
  try {  
    const {_id, notification, status } = req.body;
    console.log('id,notification, status',_id,notification, status);

    const updatedNotification = await Notification.findByIdAndUpdate(
        _id,
      { notification, status },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification updated successfully',
      data: updatedNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification retrieved successfully',
      data: notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
