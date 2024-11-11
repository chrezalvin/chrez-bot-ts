import { RouterInterface } from "@library";
import { story_get_all, story_get_default, story_get_random, story_post_add, story_post_delete, story_post_edit } from "server/controller/story";

const routes: RouterInterface[] = [
    {
        path: "/story",
        handler: story_get_random,
        method: "get",
        accessType: "public",
    },
    {
        path: "/story/all",
        handler: story_get_all,
        method: "get",
        accessType: "public",
    },
    {
        path: "/story/add",
        handler: story_post_add,
        method: "post",
        accessType: "vice",
    },
    {
        path: "/story/edit",
        handler: story_post_edit,
        method: "post",
        accessType: "vice",
    },
    {
        path: "/story/delete",
        handler: story_post_delete,
        method: "post",
        accessType: "vice",
    },
    {
        path: "/story/:id",
        handler: story_get_default,
        method: "get",
        accessType: "public",
    }
];

export default routes;