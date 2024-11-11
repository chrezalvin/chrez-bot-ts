import { RouterInterface } from "@library";
import { yomama_get_all, yomama_post_add, yomama_post_delete, yomama_post_edit } from "server/controller/yomama";

const routes: RouterInterface[] = [
    {
        path: "/yomama",
        handler: yomama_get_all,
        method: "get",
        accessType: "public",
    },
    {
        path: "/yomama/add",
        handler: yomama_post_add,
        method: "post",
        accessType: "private",
    },
    {
        path: "/yomama/delete",
        handler: yomama_post_delete,
        method: "post",
        accessType: "private",
    },
    {
        path: "/yomama/edit",
        handler: yomama_post_edit,
        method: "post",
        accessType: "private",
    }
];

export default routes;