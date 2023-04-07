import { Router } from "express";

import home from "./home";
import base from "./base";

export const routes: Router[] = [
    home,
    base,
];

export default routes;
