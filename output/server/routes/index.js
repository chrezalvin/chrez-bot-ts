"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const events_1 = __importDefault(require("./events"));
const authenticate_1 = __importDefault(require("./authenticate"));
const recommend_1 = __importDefault(require("./recommend"));
const memes_1 = __importDefault(require("./memes"));
const cursed_1 = __importDefault(require("./cursed"));
const update_1 = __importDefault(require("./update"));
const users_1 = __importDefault(require("./users"));
const story_1 = __importDefault(require("./story"));
const _library_1 = require("../../library");
const router = (0, express_1.Router)();
const routes = [
    events_1.default,
    authenticate_1.default,
    recommend_1.default,
    memes_1.default,
    cursed_1.default,
    update_1.default,
    users_1.default,
    story_1.default,
];
for (const route of routes)
    for (const routeElement of route)
        router[routeElement.method](routeElement.path, (0, middlewares_1.checkAccessType)(routeElement.accessType), (0, _library_1.asyncErrorHandler)(routeElement.handler));
exports.default = router;
//# sourceMappingURL=index.js.map