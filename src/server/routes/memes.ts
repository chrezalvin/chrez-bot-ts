import { RouterInterface } from "@library/customTypes";
import { memes_get } from "server/controller/memes";

const routes: RouterInterface[] = [
    {
        path: "/memes",
        handler: memes_get,
        method: "get",
    },
    {
        path: "/memes/:id",
        handler: memes_get,
        method: "get",
    }
];

export default routes;