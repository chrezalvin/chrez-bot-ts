"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memes_1 = require("../../server/controller/memes");
const routes = [
    {
        path: "/memes",
        handler: memes_1.memes_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/memes/:id",
        handler: memes_1.memes_get,
        method: "get",
        accessType: "public",
    },
];
exports.default = routes;
//# sourceMappingURL=memes.js.map