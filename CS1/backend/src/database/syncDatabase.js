const db =  require('./models');

// Đồng bộ các bảng trong cơ sở dữ liệu
(async () => {
  try {
    await db.sequelize.sync({ force: true }); // `force: true` sẽ xóa bảng cũ và tạo lại bảng mới
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error syncing database:", error);
  } finally {
    await db.sequelize.close();
  }
})();