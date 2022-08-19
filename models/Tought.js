const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        require: false,
    },
})

Tought.belongsTo(User)
User.hasMany(Tought)

module.exports = Tought