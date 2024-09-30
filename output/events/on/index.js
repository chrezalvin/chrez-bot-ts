"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interactionCreate_1 = __importDefault(require("./interactionCreate"));
const messageCreate_1 = __importDefault(require("./messageCreate"));
const error_1 = __importDefault(require("./error"));
const executeList = [
    interactionCreate_1.default,
    messageCreate_1.default,
    error_1.default,
];
const once = {
    name: "on",
    execute: executeList,
};
exports.default = once;
//# sourceMappingURL=index.js.map