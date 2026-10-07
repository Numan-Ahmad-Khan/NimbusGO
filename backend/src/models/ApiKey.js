const { DataTypes } = require("sequelize");
const db = require("../database/Postgres");

const ApiKey = db.define(
    "ApiKey",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        keyPrefix: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        keyHash: {
            type: DataTypes.STRING,
            allowNull: false
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

        lastUsedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "api_keys",
        timestamps: true
    }
);

module.exports = ApiKey;