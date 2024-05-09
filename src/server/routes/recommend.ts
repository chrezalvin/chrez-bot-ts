import { RouterInterface } from "@library/customTypes";
import { recommend_get_by_id, recommend_get_default, recommend_post_add, recommend_post_delete, recommend_post_update } from "server/controller/recommend";

const routes: RouterInterface[] = [
    {
        path: "/recommend",
        handler: recommend_get_default,
        method: "get",
        accessType: "public",
    },
    {
        path: "/recommend/:id",
        handler: recommend_get_by_id,
        method: "get",
        accessType: "public",
    },
    {
        path: "/recommend/add",
        handler: recommend_post_add,
        method: "post",
        accessType: "private",
    },
    {
        path: "/recommend/delete",
        handler: recommend_post_delete,
        method: "post",
        accessType: "private",
    },
    {
        path: "/recommend/update",
        handler: recommend_post_update,
        method: "post",
        accessType: "private",
    },

];

export default routes;