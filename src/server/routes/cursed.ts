import { RouterInterface } from "@library/customTypes";
import { cursed_get } from "server/controller/cursed";

const routes: RouterInterface[] = [
    {
        path: "/cursed",
        handler: cursed_get,
        method: "get",
    },
    {
        path: "/cursed/:index",
        handler: cursed_get,
        method: "get",
    },
];

export default routes;