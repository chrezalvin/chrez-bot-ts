"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const yays_json_1 = __importDefault(require("../../assets/data/yays.json"));
const command = {
    name: "yay",
    description: "yays whenever users says yay",
    searchCriteria: [/^y(a|e)*y/i, /^yeeee+s/i],
    execute: (message) => {
        message.channel.send(yays_json_1.default.yays[(0, _library_1.rngInt)(0, yays_json_1.default.yays.length - 1)]);
    },
};
exports.default = command;
//# sourceMappingURL=yay.js.map