import { RouterInterface } from "@library/customTypes";
import { authenticate_get, authenticate_post, authenticate_server, getUserProfile } from "server/controller/authenticate";

export const routes: RouterInterface[] = [
    {
        path: "/authenticate",
        handler: authenticate_get,
        method: "get",
    },
    {
        path: "/authenticate",
        handler: authenticate_post,
        method: "post",
    },
    {
        path: "/authenticate_server",
        handler: authenticate_server,
        method: "get",
    },
    {
        path: "/profile",
        handler: getUserProfile,
        method: "get",
    }
];

export default routes;