require('dotenv').config();
const http = require('http');
const cluster = require('cluster');
const os = require('os');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const { initSocket } = require('./src/config/socket');

const PORT = process.env.PORT || 5001;
const numCPUs = os.cpus().length;

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  console.log(`\n🚀 Primary Process ${process.pid} is starting...`);
  console.log(`💻 System: ${os.type()} | Cores: ${numCPUs}`);
  console.log(`📡 Deployment: Ready for Market\n`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`⚠️ Worker ${worker.process.pid} died. Reviving...`);
    cluster.fork();
  });
} else {
  // Worker process logic
  const startServer = async () => {
    try {
      // 1. Connect to Database & Redis
      await connectDB();
      // await connectRedis();

      // 2. Start HTTP Server
      const server = http.createServer(app);

      // 3. Initialize Socket.io
      initSocket(server);

      // Bind to 0.0.0.0 for external access (Market Ready)
      server.listen(PORT, '0.0.0.0', () => {
        if (cluster.isWorker && cluster.worker.id === 1 || !cluster.isWorker) {
          console.log(`\n✅ Server Status: ONLINE`);
          console.log(`🚀 API Base:   http://localhost:${PORT}/api/v1`);
          console.log(`💚 Health:     http://localhost:${PORT}/api/v1/health`);
          console.log(`🌐 Network:    0.0.0.0:${PORT}\n`);
        }
      });

      // Handle rejections
      process.on('unhandledRejection', (err) => {
        console.error(`❌ Worker ${process.pid} Error: ${err.message}`);
        server.close(() => process.exit(1));
      });

      // Graceful shutdown
      process.on('SIGTERM', () => {
        server.close(() => process.exit(0));
      });

    } catch (error) {
      console.error(`❌ Failed to start worker ${process.pid}:`, error.message);
      process.exit(1);
    }
  };

  startServer();
}
