"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_1 = require("../../server/controller/update");
const routes = [
    {
        path: "/update",
        handler: update_1.update_get_all,
        method: "get",
        accessType: "public",
    },
    {
        path: "/update/:version",
        handler: update_1.update_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/update/latest",
        handler: update_1.update_get_latest,
        method: "get",
        accessType: "public",
    },
    {
        path: "/update/add",
        handler: update_1.update_add,
        method: "post",
        accessType: "owner",
    },
];
exports.default = routes;
//# sourceMappingURL=update.js.map