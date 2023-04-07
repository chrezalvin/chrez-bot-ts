"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.User = exports.init = void 0;
const _config_1 = require("../../config");
const user_1 = __importDefault(require("./user"));
const event_1 = __importDefault(require("./event"));
const models = [
    user_1.default,
    event_1.default
];
const isDev = _config_1.MODE !== "production";
exports.init = (async () => {
    for (const model of models) {
        console.log(`syncing ${model.getTableName()}`);
        await model.sync({ force: true });
    }
});
var user_2 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_2).default; } });
var event_2 = require("./event");
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return __importDefault(event_2).default; } });
