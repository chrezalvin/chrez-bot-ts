"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.addEvent = exports.Event = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
class Ev extends sequelize_1.Model {
}
exports.Event = config_1.default.define("event", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    maker_id: sequelize_1.DataTypes.STRING,
    name: sequelize_1.DataTypes.TEXT,
    date: sequelize_1.DataTypes.DATE,
    description: sequelize_1.DataTypes.TEXT,
    repeat: sequelize_1.DataTypes.TEXT,
});
async function addEvent(maker_id, name, date, description, isRepeat) {
    const now = new Date();
    if (now > date)
        throw new Error("The date of event is already expired");
    const data = await exports.Event.create({
        id: 0,
        maker_id: maker_id,
        date: date,
        name: name,
        description: description,
        repeat: isRepeat
    });
    return true;
}
exports.addEvent = addEvent;
async function deleteEvent(id) {
    return true;
}
exports.deleteEvent = deleteEvent;
exports.default = exports.Event;
