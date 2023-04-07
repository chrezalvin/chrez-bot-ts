"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
exports.Event = config_1.default.define("event", {
    name: sequelize_1.DataTypes.TEXT
});
exports.default = exports.Event;
