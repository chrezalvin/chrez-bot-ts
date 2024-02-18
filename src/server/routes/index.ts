import { Router } from "express";

import event from "./events";
import authenticate from "./authenticate";
import recommend from "./recommend";
import memes from "./memes";
import cursed from "./cursed";
import update from "./update";

export const routes: Router[] = [
    event,
    authenticate,
    recommend,
    memes,
    cursed,
    update
];

export default routes;
