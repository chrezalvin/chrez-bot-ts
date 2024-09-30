"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const authenticate_1 = require("../../server/controller/authenticate");
exports.routes = [
    {
        path: "/authenticate",
        handler: authenticate_1.authenticate_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/authenticate",
        handler: authenticate_1.authenticate_post,
        method: "post",
        accessType: "public",
    },
    {
        path: "/authenticate_server",
        handler: authenticate_1.authenticate_server,
        method: "get",
        accessType: "public",
    },
    {
        path: "/profile",
        handler: authenticate_1.getUserProfile,
        method: "get",
        accessType: "private",
    }
];
exports.default = exports.routes;
//# sourceMappingURL=authenticate.js.map