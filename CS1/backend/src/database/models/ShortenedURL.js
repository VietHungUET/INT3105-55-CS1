module.exports = (sequelize, DataTypes) => {
  const ShortenedURL = sequelize.define(
      'ShortenedURL',
      {
          id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
          },
          originalUrl: {
              type: DataTypes.STRING,
              allowNull: false,
          },
          shortenedUrl: {
              type: DataTypes.STRING,
              allowNull: false,
              unique: true,
          },
          userId: {
              type: DataTypes.INTEGER,
              references: {
                  model: 'User', // Chắc chắn rằng tên bảng đúng
                  key: 'id',
              },
              allowNull: true,
          },
          createdAt: {
              type: DataTypes.DATE,
              defaultValue: DataTypes.NOW,
          },
      },
      {
          freezeTableName: true,
      }
  );

  ShortenedURL.associate = function (models) {
      ShortenedURL.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return ShortenedURL;
}
