import { RouterInterface } from "@library/customTypes";
import { cursed_get } from "server/controller/cursed";

const routes: RouterInterface[] = [
    {
        path: "/cursed",
        handler: cursed_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/cursed/:index",
        handler: cursed_get,
        method: "get",
        accessType: "public",
    },
];

export default routes;