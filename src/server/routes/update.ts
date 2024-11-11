import { RouterInterface } from "@library";
import { update_get, update_get_all, update_post_add, update_get_latest, update_post_delete, update_post_update} from "server/controller/update";

const routes: RouterInterface[] = [
    {
        path: "/update",
        handler: update_get_all,
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
        handler: update_post_add,
        method: "post",
        accessType: "owner",
    },
    {
        path: "/update/delete",
        handler: update_post_delete,
        method: "post",
        accessType: "owner",
    },
    {
        path: "/update/edit",
        handler: update_post_update,
        method: "post",
        accessType: "owner",
    },
    {
        path: "/update/:version",
        handler: update_get,
        method: "get",
        accessType: "public",
    },
];

export default routes;