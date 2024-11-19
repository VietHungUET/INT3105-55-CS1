require('dotenv').config();
const express = require('express');
const cluster = require('cluster');
const os = require('os');
const { PORT } = require('./config');
const db = require('./database/models');
const expressApp = require('./express-app');
const { startConsumer } = require('./queue/consumer');

const StartServer = async () => {
  const app = express();

  try {
    await db.sequelize.sync();
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Failed to sync database:", error);
    process.exit(); // Thoát nếu có lỗi kết nối
  }

  await expressApp(app);

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  }).on('error', (err) => {
    console.error(err);
    process.exit();
  });
};

if (cluster.isMaster) {
  const numWorkers = 5; // Số lượng worker
  console.log(`Master process ${process.pid} is running`);

  // Khởi chạy worker pool
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited. Forking a new one.`);
    cluster.fork();
  });

  // Chỉ Master mới chạy server chính
  StartServer();
} else {
  console.log(`Worker process ${process.pid} is running`);
  startConsumer(); // Worker chạy consumer
}
