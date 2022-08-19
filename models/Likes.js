const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')
const Tought = require('./Tought')

const Likes = db.define('Likes', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
          },
          ToughtId: {
          type: DataTypes.INTEGER,
           references: {
          model: "Toughts",
          key: "id",
           },
        onUpdate: "cascade",
        onDelete: "cascade",
         },
         UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
         },
         createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
         },
        updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
          },
})

Likes.belongsTo(User);
Likes.belongsTo(Tought);
Tought.hasMany(Likes);
User.hasMany(Likes);

module.exports = Likes