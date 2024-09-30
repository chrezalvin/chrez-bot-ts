"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const _config_1 = require("../config");
const user_1 = __importDefault(require("./models/user"));
const event_1 = __importDefault(require("./models/event"));
const models = [
    user_1.default,
    event_1.default
];
const isDev = _config_1.MODE !== "production";
exports.init = (async () => {
    for (const model of models) {
        console.log(`syncing ${model.getTableName()}`);
        await model.sync({ alter: isDev, logging: false, });
    }
});
__exportStar(require("./models/user"), exports);
__exportStar(require("./models/event"), exports);
