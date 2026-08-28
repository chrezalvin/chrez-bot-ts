import { RouterInterface } from "@library";
import { Router } from "express";
import { authenticate_get, authenticate_server } from "server/controller/authenticate";
import { requireUser } from "server/middlewares/requireUser";

const router = Router();

router.get("/authenticate", authenticate_get);
router.get("/authenticate_server", authenticate_server);

export default router;