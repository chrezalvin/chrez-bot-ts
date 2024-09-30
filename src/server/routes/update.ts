import { RouterInterface } from "@library";
import { update_get, update_get_all, update_add, update_get_latest} from "server/controller/update";

const routes: RouterInterface[] = [
    {
        path: "/update",
        handler: update_get_all,
        method: "get",
        accessType: "public",
    },
    {
        path: "/update/:version",
        handler: update_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/update/latest",
        handler: update_get_latest,
        method: "get",
        accessType: "public",
    },
    {
        path: "/update/add",
        handler: update_add,
        method: "post",
        accessType: "owner",
    },
];

export default routes;