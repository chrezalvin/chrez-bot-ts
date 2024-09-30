"use strict";
// session stores for server (cached)
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessions = void 0;
const _library_1 = require("../library");
// 1 hour session by default
exports.sessions = new _library_1.TemporaryMap(60 * 60 * 1000);
exports.default = exports.sessions;
//# sourceMappingURL=UserSessions.js.map