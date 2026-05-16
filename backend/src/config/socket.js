const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const jwt = require('jsonwebtoken');
const { redisClient } = require('./redis');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
      credentials: true
    }
  });

  // Setup Redis Adapter for Clustering support
  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();
  
  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Socket.io Redis Adapter Setup Done');
  });

  // Middleware: Authenticate Socket Connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`🔌 User Connected: ${userId} (Socket: ${socket.id})`);

    // Join a personal room named after the userId for private messaging
    socket.join(userId);

    // Broadcast online status to all connected users
    socket.broadcast.emit('user_online', { userId });

    // ─── Typing Indicators ─────────────────────────────────
    socket.on('typing', ({ to }) => {
      if (to) {
        io.to(to).emit('typing', { from: userId });
      }
    });

    socket.on('stop_typing', ({ to }) => {
      if (to) {
        io.to(to).emit('stop_typing', { from: userId });
      }
    });

    // ─── Message Read Receipt ──────────────────────────────
    socket.on('mark_read', ({ from }) => {
      if (from) {
        io.to(from).emit('messages_read', { by: userId });
      }
    });

    // ─── Disconnect ────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`❌ User Disconnected: ${userId}`);
      socket.broadcast.emit('user_offline', { userId });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
