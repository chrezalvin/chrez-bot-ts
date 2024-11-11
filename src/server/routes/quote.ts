import { RouterInterface } from "@library";
import { quote_get_all, quote_post_add, quote_post_delete, quote_post_edit } from "server/controller/quote";

const routes: RouterInterface[] = [
    {
        path: "/quote",
        handler: quote_get_all,
        method: "get",
        accessType: "public",
    },
    {
        path: "/quote/add",
        handler: quote_post_add,
        method: "post",
        accessType: "private",
    },
    {
        path: "/quote/edit",
        handler: quote_post_edit,
        method: "post",
        accessType: "private",
    },
    {
        path: "/quote/delete",
        handler: quote_post_delete,
        method: "post",
        accessType: "private",
    },
];

export default routes;