require('dotenv').config();
const http = require('http');
const cluster = require('cluster');
const os = require('os');

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/config/socket');
const User = require('./src/models/User');

let isConnected = false;

/**
 * 👤 Seed Super Admin on startup
 */
const seedSuperAdmin = async () => {
  try {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'kuldeepkumawat2383@gmail.com';
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123';

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log(`👤 Seeding new Super Admin user: ${adminEmail}`);
      admin = new User({
        fullname: 'Super Admin',
        email: adminEmail,
        countryCode: '+91',
        phoneNumber: '9876543210',
        password: adminPassword,
        role: 'super_admin',
        isOtpVerified: true,
        isHiringOtpVerified: true,
        isActive: true,
      });
      await admin.save();
      console.log('✅ Super Admin seeded successfully.');
    } else {
      let isModified = false;
      if (admin.role !== 'super_admin') {
        admin.role = 'super_admin';
        isModified = true;
      }
      const isMatch = await admin.matchPassword(adminPassword);
      if (!isMatch) {
        console.log(`🔑 Updating Super Admin password to match .env...`);
        admin.password = adminPassword;
        isModified = true;
      }
      if (isModified) {
        await admin.save();
        console.log('✅ Super Admin credentials synchronized.');
      } else {
        console.log('✅ Super Admin credentials verified.');
      }
    }
  } catch (error) {
    console.error('❌ Failed to seed Super Admin:', error.message);
  }
};

/**
 * 🔌 Ensure DB is connected (used for both Vercel and local)
 */
const ensureConnection = async () => {
  if (!isConnected) {
    await connectDB();
    await seedSuperAdmin();
    isConnected = true;
  }
};

// ─── Vercel Serverless Mode ─────────────────────────────
if (process.env.VERCEL) {
  ensureConnection().catch(err => {
    console.error('❌ MongoDB Connection failed on Vercel:', err.message);
  });
  module.exports = app;
} else {
  // ─── Local / Production Server Mode ─────────────────────
  const PORT = process.env.PORT || 5000;
  const numCPUs = os.cpus().length;

  if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
    console.log(`\n🚀 Primary Process ${process.pid} is starting...`);
    console.log(`💻 System: ${os.type()} | Cores: ${numCPUs}`);
    console.log(`📡 Deployment: Ready for Market\n`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.error(`⚠️ Worker ${worker.process.pid} died. Reviving...`);
      cluster.fork();
    });
  } else {
    const startServer = async () => {
      try {
        await ensureConnection();

        const server = http.createServer(app);
        initSocket(server);

        server.listen(PORT, '0.0.0.0', () => {
          if ((cluster.isWorker && cluster.worker.id === 1) || !cluster.isWorker) {
            console.log(`\n✅ Server Status: ONLINE`);
            console.log(`🚀 API Base:   http://localhost:${PORT}/api/v1`);
            console.log(`💚 Health:     http://localhost:${PORT}/api/v1/health`);
            console.log(`🌐 Network:    0.0.0.0:${PORT}\n`);
          }
        });

        process.on('unhandledRejection', (err) => {
          console.error(`❌ Worker ${process.pid} Error: ${err.message}`);
          server.close(() => process.exit(1));
        });

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
}