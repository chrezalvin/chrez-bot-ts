import { RouterInterface } from "@library/customTypes";
import { events_add_event, events_get } from "server/controller/events";

const routes: RouterInterface[] = [
    {
        path: "/events",
        handler: events_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/events/:monthName",
        handler: events_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/events/add",
        handler: events_add_event,
        method: "post",
        accessType: "private",
    },
];

export default routes;