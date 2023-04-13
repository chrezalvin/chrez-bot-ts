import { Router } from "express";

import home from "./home";
import base from "./base";
import event from "./event";

export const routes: Router[] = [
    home,
    base,
    event
];

export default routes;
