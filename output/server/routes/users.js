"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../server/controller/user");
const routes = [
    {
        path: "/user/:userid",
        handler: user_1.getUserById,
        method: "post",
        accessType: "private",
    }
];
exports.default = routes;
//# sourceMappingURL=users.js.map