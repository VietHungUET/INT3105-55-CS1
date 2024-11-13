require('dotenv').config();  
const dbConfig = require('../db-config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize (dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
          host: dbConfig.HOST,
          dialect: dbConfig.DIALECT
});

const db = {};

db.Sequelize = Sequelize;

db.sequelize = sequelize;

db.models = {};

db.models.User = require('./user') (sequelize, Sequelize. DataTypes);

db.models.ShortenedURL = require('./ShortenedURL') (sequelize, Sequelize. DataTypes);

Object.keys(db.models).forEach(modelName => {
    if (db.models[modelName].associate) {
        db.models[modelName].associate(db.models);
    }
});

module.exports = db;

