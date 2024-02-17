import { Router } from "express";
import { authenticate_get, authenticate_post } from "server/controller/authenticate";

const router = Router();

router.get("/authenticate", authenticate_get);
router.post("/authenticate", authenticate_post);

export default router;