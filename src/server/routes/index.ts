import { Router } from "express";
import {checkAccessType} from "../middlewares";

import event from "./events";
import authenticate from "./authenticate";
import recommend from "./recommend";
import memes from "./memes";
import cursed from "./cursed";
import update from "./update";
import users from "./users";
import story from "./story";
import registlet from "./registlet";
import quote from "./quote";
import yomama from "./yomama";
import activeEvents from "./activeEvents";
import events from "./events";

import { RouterInterface } from "@library";
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
    story,
    registlet,
    quote,
    yomama,
    activeEvents,
    events,
];

for(const route of routes)
    for(const routeElement of route)
        if(routeElement.requestHandler)
            router[routeElement.method](
                routeElement.path, 
                checkAccessType(routeElement.accessType),
                routeElement.requestHandler,
                asyncErrorHandler(routeElement.handler),
            );
        else
            router[routeElement.method](
                routeElement.path, 
                checkAccessType(routeElement.accessType),
                asyncErrorHandler(routeElement.handler),
            );

export default router;