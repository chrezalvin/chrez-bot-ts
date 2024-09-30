"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recommend_1 = require("../../server/controller/recommend");
const routes = [
    {
        path: "/recommend",
        handler: recommend_1.recommend_get_default,
        method: "get",
        accessType: "public",
    },
    {
        path: "/recommend/:id",
        handler: recommend_1.recommend_get_by_id,
        method: "get",
        accessType: "public",
    },
    {
        path: "/recommend/add",
        handler: recommend_1.recommend_post_add,
        method: "post",
        accessType: "private",
    },
    {
        path: "/recommend/delete",
        handler: recommend_1.recommend_post_delete,
        method: "post",
        accessType: "private",
    },
    {
        path: "/recommend/update",
        handler: recommend_1.recommend_post_update,
        method: "post",
        accessType: "private",
    },
];
exports.default = routes;
//# sourceMappingURL=recommend.js.map