import { Router } from "express";

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

const routes: Router[] = [
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

export default routes;