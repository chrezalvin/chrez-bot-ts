import { RouterInterface } from "@library";
import { memes_get } from "server/controller/memes";

const routes: RouterInterface[] = [
    {
        path: "/memes",
        handler: memes_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/memes/:id",
        handler: memes_get,
        method: "get",
        accessType: "public",
    },
];

export default routes;