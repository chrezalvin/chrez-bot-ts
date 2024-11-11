import { RouterInterface } from "@library";
import { registlet_get_all, registlet_post_add, registlet_post_delete, registlet_post_edit, registlet_search_get} from "server/controller/registlet";
import upload from "server/multerConfig";

const routes: RouterInterface[] = [
    {
        path: "/registlet",
        handler: registlet_search_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/registlet/all",
        handler: registlet_get_all,
        method: "get",
        accessType: "public",
    },
    {
        path: "/registlet/add",
        handler: registlet_post_add,
        method: "post",
        accessType: "private",
        requestHandler: upload.single("image"),
    },
    {
        path: "/registlet/update",
        handler: registlet_post_edit,
        method: "post",
        accessType: "private",
        requestHandler: upload.single("image"),
    },
    {
        path: "/registlet/delete",
        handler: registlet_post_delete,
        method: "post",
        accessType: "private",
    }
];

export default routes;