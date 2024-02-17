import { Router } from "express";

import event from "./events";
import authenticate from "./authenticate";
import recommend from "./recommend";
import memes from "./memes";
import cursed from "./cursed";

export const routes: Router[] = [
    event,
    authenticate,
    recommend,
    memes,
    cursed,
];

export default routes;
