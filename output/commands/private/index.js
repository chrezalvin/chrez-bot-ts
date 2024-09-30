"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const bulkdelete_1 = __importDefault(require("./bulkdelete"));
const why_1 = __importDefault(require("./why"));
const setmute_1 = __importDefault(require("./setmute"));
const unmute_1 = __importDefault(require("./unmute"));
const addRecommend_1 = __importDefault(require("./addRecommend"));
// import notifyRaid from "./notifyRaid";
exports.commands = [
    bulkdelete_1.default,
    why_1.default,
    setmute_1.default,
    unmute_1.default,
    addRecommend_1.default,
    // notifyRaid
]
    .filter(command => command.mode !== "unavailable")
    .map(command => command.setStatus("private"));
exports.default = exports.commands;
//# sourceMappingURL=index.js.map