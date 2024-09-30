"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cry_1 = __importDefault(require("./cry"));
const weirdThing_1 = __importDefault(require("./weirdThing"));
const rice_1 = __importDefault(require("./rice"));
const commandList = [
    cry_1.default,
    rice_1.default,
    weirdThing_1.default,
]
    .filter(command => command.mode !== "unavailable")
    .map(command => command.setStatus("hidden"));
exports.default = commandList;
//# sourceMappingURL=index.js.map