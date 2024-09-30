import { RouterInterface } from "@library";
import { authenticate_get, authenticate_post, authenticate_server, getUserProfile } from "server/controller/authenticate";

export const routes: RouterInterface[] = [
    {
        path: "/authenticate",
        handler: authenticate_get,
        method: "get",
        accessType: "public",
    },
    {
        path: "/authenticate",
        handler: authenticate_post,
        method: "post",
        accessType: "public",
    },
    {
        path: "/authenticate_server",
        handler: authenticate_server,
        method: "get",
        accessType: "public",
    },
    {
        path: "/profile",
        handler: getUserProfile,
        method: "get",
        accessType: "private",
    }
];

export default routes;