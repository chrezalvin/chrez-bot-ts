import { RouterInterface } from "@library/customTypes";
import { ping_get } from "server/controller/ping";

const routes: RouterInterface[] = [
    {
        path: "/ping",
        handler: ping_get,
        method: "get",
        accessType: "public",
    }
];

export default routes;