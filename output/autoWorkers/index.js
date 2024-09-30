"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const birthday_1 = __importDefault(require("./birthday"));
const recommend_1 = __importDefault(require("./recommend"));
const reloadDatabase_1 = __importDefault(require("./reloadDatabase"));
const autoWorkersList = [
    birthday_1.default,
    recommend_1.default,
    reloadDatabase_1.default
];
exports.default = autoWorkersList;
//# sourceMappingURL=index.js.map