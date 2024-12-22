import { RouterInterface } from "@library";
import { authenticate_get, authenticate_server, get_discord_profile, getUserProfile } from "server/controller/authenticate";

export const routes: RouterInterface[] = [
    {
        path: "/authenticate",
        handler: authenticate_get,
        method: "get",
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
    },
    {
        path: "/profile/discord",
        handler: get_discord_profile,
        method: "get",
        accessType: "private",
    }
];

export default routes;