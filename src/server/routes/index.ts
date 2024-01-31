import { Router } from "express";

import home from "./home";
import base from "./base";
import event from "./events";
import authenticate from "./authenticate";
import recommend from "./recommend";

export const routes: Router[] = [
    home,
    base,
    event,
    authenticate,
    recommend,
];

export default routes;
