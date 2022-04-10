const { Model, Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        pin: {
            type: DataTypes.STRING,
            allowNull: false
        },
        placed: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }
    },
    { sequelize, modelName: 'user' }
);
module.exports = User;