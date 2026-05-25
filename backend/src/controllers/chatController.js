const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const { getIO } = require('../config/socket');
const { redisClient } = require('../config/redis');

// Load settings from .env
const CACHE_LIMIT = parseInt(process.env.CHAT_CACHE_LIMIT) || 100;
const CACHE_EXPIRY = 60 * 60 * 24; // 24 Hours for active cache

// @desc    Send a message
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res.status(400).json({ success: false, statusCode: 400, message: 'Receiver ID and content are required' });
    }

    const message = await Message.create({ senderId, receiverId, content });

    /*
    // Cache in Redis
    const chatKey = [senderId, receiverId].sort().join(':');
    const cacheKey = `chat_history:${chatKey}`;
    await redisClient.lPush(cacheKey, JSON.stringify(message));
    await redisClient.lTrim(cacheKey, 0, CACHE_LIMIT - 1);
    await redisClient.expire(cacheKey, CACHE_EXPIRY);
    */

    // Emit Real-time via Socket.io
    const io = getIO();
    io.to(receiverId).emit('receiveMessage', message);
    io.to(senderId).emit('messageSent', message);

    res.status(201).json({ success: true, statusCode: 201, message: 'Message sent successfully', data: message });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation between two users
exports.getMessages = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user.id;

    const chatKey = [myId, otherUserId].sort().join(':');
    const cacheKey = `chat_history:${chatKey}`;
    
    /*
    let messages = await redisClient.lRange(cacheKey, 0, -1);
    
    if (messages && messages.length > 0) {
      messages = messages.map(msg => JSON.parse(msg)).reverse();
    } else {
    */
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: myId }
        ]
      }).sort('createdAt').limit(CACHE_LIMIT);

    /*
      if (messages.length > 0) {
        const pipe = redisClient.multi();
        messages.slice().reverse().forEach(msg => {
          pipe.lPush(cacheKey, JSON.stringify(msg));
        });
        pipe.lTrim(cacheKey, 0, CACHE_LIMIT - 1);
        pipe.expire(cacheKey, CACHE_EXPIRY);
        await pipe.exec();
      }
    }
    */

    // Mark as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: myId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, statusCode: 200, message: 'Conversation fetched', data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all conversations for current user
exports.getMyChats = async (req, res, next) => {
  try {
    const myId = req.user.id;
    const myObjectId = new mongoose.Types.ObjectId(myId);

    // Aggregate to find unique users and their last messages
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: myObjectId }, { receiverId: myObjectId }]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", myObjectId] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$$ROOT" }
        }
      }
    ]);

    // Fetch user details and count unread messages for each conversation
    const chatListData = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = await User.findById(conv._id).select('fullname profilePhoto role');
        
        // Count unread messages sent by the other user to me
        const unreadCount = await Message.countDocuments({
          senderId: conv._id,
          receiverId: myId,
          isRead: false
        });

        return {
          user: otherUser,
          lastMessage: conv.lastMessage,
          unreadCount
        };
      })
    );

    // Sort by most recent message
    chatListData.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'All chats fetched with previews',
      data: chatListData
    });
  } catch (error) {
    next(error);
  }
};
