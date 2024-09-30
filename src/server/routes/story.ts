import { RouterInterface } from "@library";
import { story_get_default, story_get_random } from "server/controller/story";

const routes: RouterInterface[] = [
    {
        path: "/story",
        handler: story_get_random,
        method: "get",
        accessType: "public",
    },
    {
        path: "/story/:id",
        handler: story_get_default,
        method: "get",
        accessType: "public",
    },
];

export default routes;