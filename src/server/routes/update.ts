import { RouterInterface } from "@library/customTypes";
import { update_get, update_get_all} from "server/controller/update";

const routes: RouterInterface[] = [
    {
        path: "/update",
        handler: update_get_all,
        method: "get",
    },
    {
        path: "/update/:version",
        handler: update_get,
        method: "get",
    },
];

export default routes;