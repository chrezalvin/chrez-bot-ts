"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../server/controller/events");
const routes = [
    {
        path: "/events",
        handler: events_1.events_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/events/add",
        handler: events_1.events_add_event,
        method: "post",
        accessType: "private",
    },
    {
        path: "/events/all",
        handler: events_1.events_get_all,
        method: "get",
        accessType: "public",
    }
];
exports.default = routes;
//# sourceMappingURL=events.js.map