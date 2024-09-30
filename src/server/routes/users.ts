import { RouterInterface } from "@library";
import { getUserById } from "server/controller/user";

const routes: RouterInterface[] = [
    {
        path: "/user/:userid",
        handler: getUserById,
        method: "post",
        accessType: "private",
    }
];

export default routes;