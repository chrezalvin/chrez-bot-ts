import { RouterInterface } from "@library/customTypes";
import { getUserById } from "server/controller/user";

const routes: RouterInterface[] = [
    {
        path: "/user/:userid",
        handler: getUserById,
        method: "post",
    }
];

export default routes;