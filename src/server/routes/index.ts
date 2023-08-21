import { Router } from "express";

import home from "./home";
import base from "./base";
import event from "./event";
import authenticate from "./authenticate";

export const routes: Router[] = [
    home,
    base,
    event,
    authenticate
];

export default routes;
