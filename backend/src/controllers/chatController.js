const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/v1/chat/send
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Receiver ID and content are required', data: null });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation between two users
// @route   GET /api/v1/chat/messages/:userId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId }
      ]
    }).sort('createdAt');

    // Mark received messages as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: myId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Conversation fetched',
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all conversations for current user
// @route   GET /api/v1/chat/my-chats
// @access  Private
exports.getMyChats = async (req, res, next) => {
  try {
    const myId = req.user.id;

    // Find all unique users I have chatted with
    const messages = await Message.find({
      $or: [{ senderId: myId }, { receiverId: myId }]
    }).sort('-createdAt');

    const chatUsers = [];
    const addedIds = new Set();

    messages.forEach(msg => {
      const otherUser = msg.senderId.toString() === myId ? msg.receiverId : msg.senderId;
      if (!addedIds.has(otherUser.toString())) {
        addedIds.add(otherUser.toString());
        chatUsers.push(otherUser);
      }
    });

    const users = await User.find({ _id: { $in: chatUsers } }).select('fullname profilePhoto role');

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'All chats fetched',
      data: users
    });
  } catch (error) {
    next(error);
  }
};
