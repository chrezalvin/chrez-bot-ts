"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const story_1 = require("../../server/controller/story");
const routes = [
    {
        path: "/story",
        handler: story_1.story_get_random,
        method: "get",
        accessType: "public",
    },
    {
        path: "/story/:id",
        handler: story_1.story_get_default,
        method: "get",
        accessType: "public",
    },
];
exports.default = routes;
//# sourceMappingURL=story.js.map