"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const bulkdelete_1 = __importDefault(require("./bulkdelete"));
const why_1 = __importDefault(require("./why"));
const laugh_1 = __importDefault(require("./laugh"));
exports.commands = [
    bulkdelete_1.default,
    why_1.default,
    laugh_1.default
].filter(command => !command.unavailable);
exports.default = exports.commands;
