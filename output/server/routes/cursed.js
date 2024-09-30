"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cursed_1 = require("../../server/controller/cursed");
const routes = [
    {
        path: "/cursed",
        handler: cursed_1.cursed_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/cursed/:index",
        handler: cursed_1.cursed_get,
        method: "get",
        accessType: "public",
    },
];
exports.default = routes;
//# sourceMappingURL=cursed.js.map