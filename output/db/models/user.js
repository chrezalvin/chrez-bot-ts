"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
exports.User = config_1.default.define("user", {
    name: sequelize_1.DataTypes.TEXT,
    favoriteColor: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: 'green'
    },
    age: sequelize_1.DataTypes.INTEGER,
    cash: sequelize_1.DataTypes.INTEGER
});
exports.default = exports.User;
