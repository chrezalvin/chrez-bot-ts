import { RouterInterface } from "@library";
import { activeEvents_get_all, activeEvents_get_by_id, activeEvents_get_incoming, activeEvents_get_ongoing, activeEvents_post_add, activeEvents_post_delete, activeEvents_post_edit } from "server/controller/activeEvents";
import upload from "server/multerConfig";

const routes: RouterInterface[] = [
    {
        path: "/activeEvents",
        handler: activeEvents_get_all,
        method: "get",
        accessType: "public",
    },
    {
        path: "/activeEvents/all",
        handler: activeEvents_get_all,
        method: "get",
        accessType: "public",
    },
    {
        path: "/activeEvents/incoming",
        handler: activeEvents_get_incoming,
        method: "get",
        accessType: "public",
    },
    {
        path: "/activeEvents/ongoing",
        handler: activeEvents_get_ongoing,
        method: "get",
        accessType: "public",
    },
    {
        path: "/activeEvents/add",
        handler: activeEvents_post_add,
        method: "post",
        accessType: "private",
        requestHandler: upload.single("image"),
    },
    {
        path: "/activeEvents/edit",
        handler: activeEvents_post_edit,
        method: "post",
        accessType: "private",
        requestHandler: upload.single("image"),
    },
    {
        path: "/activeEvents/delete",
        handler: activeEvents_post_delete,
        method: "post",
        accessType: "private",
    },
    {
        path: "/activeEvents/:id",
        handler: activeEvents_get_by_id,
        method: "get",
        accessType: "public",
    }
];

export default routes;