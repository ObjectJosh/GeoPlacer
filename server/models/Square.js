const { Model, Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Square extends Model {}

Square.init(
    {
        id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // lat: {
        //     type: DataTypes.TEXT,
        //     allowNull: false
        // },
        // long: {
        //     type: DataTypes.TEXT,
        //     allowNull: false
        // }
        x: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
        y: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        changed: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }
    },
    { sequelize, modelName: 'square' }
);
module.exports = Square;