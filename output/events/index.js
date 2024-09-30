"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.botEvents = void 0;
const on_1 = __importDefault(require("./on"));
const once_1 = __importDefault(require("./once"));
exports.botEvents = [
    on_1.default, once_1.default
];
exports.default = exports.botEvents;
//# sourceMappingURL=index.js.map