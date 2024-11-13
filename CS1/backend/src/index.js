require('dotenv').config();
const express = require('express');
const { PORT } = require('./config');
const db =  require('./database/models');
const expressApp = require('./express-app');
const { exec } = require('child_process');

const StartServer = async () => {

    const app = express();
    
    try {
        await db.sequelize.sync({ force: true });
        console.log("Database synced successfully!");
      } catch (error) {
        console.error("Failed to sync database:", error);
        process.exit(); // Thoát nếu có lỗi kết nối
      }
    // await databaseConnection();
    await expressApp(app);

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
        .on('error', (err) => {
            console.log(err);
            process.exit();
        });

};
StartServer();