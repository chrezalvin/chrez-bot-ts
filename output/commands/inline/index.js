"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const pewpew_1 = __importDefault(require("./pewpew"));
const greet_1 = __importDefault(require("./greet"));
exports.commands = [
    pewpew_1.default,
    greet_1.default
].filter(command => !command.unavailable);
;
exports.default = exports.commands;
