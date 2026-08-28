import { Router } from "express";
import { getUserById } from "server/controller/user";
import { requireUser } from "server/middlewares/requireUser";

const router = Router();

router.post("/user/:userid", requireUser({roles: ["owner"]}), getUserById);

export default router;