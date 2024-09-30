"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const pewpew_1 = __importDefault(require("./pewpew"));
const greet_1 = __importDefault(require("./greet"));
const die_1 = __importDefault(require("./die"));
const yay_1 = __importDefault(require("./yay"));
const ctest_1 = __importDefault(require("./ctest"));
const lick_1 = __importDefault(require("./lick"));
const sad_1 = __importDefault(require("./sad"));
const dontyell_1 = __importDefault(require("./dontyell"));
const no_1 = __importDefault(require("./no"));
const itsokay_1 = __importDefault(require("./itsokay"));
exports.commands = [
    pewpew_1.default,
    greet_1.default,
    die_1.default,
    yay_1.default,
    ctest_1.default,
    lick_1.default,
    sad_1.default,
    dontyell_1.default,
    no_1.default,
    itsokay_1.default,
].filter(command => !command.unavailable);
exports.default = exports.commands;
//# sourceMappingURL=index.js.map