const express = require('express');
const { sendMessage, getMessages, getMyChats } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/send', sendMessage);
router.get('/messages/:userId', getMessages);
router.get('/my-chats', getMyChats);

module.exports = router;
