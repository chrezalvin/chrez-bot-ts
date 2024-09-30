"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ready_1 = __importDefault(require("./ready"));
const executeList = [
    ready_1.default
];
const once = {
    name: "once",
    execute: executeList,
};
exports.default = once;
//# sourceMappingURL=index.js.map