import { RouterInterface } from "@library";
import { events_add_event, events_get, events_get_all } from "server/controller/events";

const routes: RouterInterface[] = [
    {
        path: "/events",
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
    {
        path: "/events/all",
        handler: events_get_all,
        method: "get",
        accessType: "public",
    }
];

export default routes;