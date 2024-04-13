import { Router } from "express";

import event from "./events";
import authenticate from "./authenticate";
import recommend from "./recommend";
import memes from "./memes";
import cursed from "./cursed";
import update from "./update";
import users from "./users";
import { RouterInterface } from "@library/customTypes";
import { asyncErrorHandler } from "@library";

const router: Router = Router();

const routes: RouterInterface[][] = [
    event,
    authenticate,
    recommend,
    memes,
    cursed,
    update,
    users,
];

for(const route of routes)
    for(const routeElement of route)
        router[routeElement.method](routeElement.path, asyncErrorHandler(routeElement.handler));

export default router;