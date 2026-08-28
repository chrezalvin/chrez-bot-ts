import { Router } from "express";
import {story_get_default, story_get_random, story_post_add, story_post_delete, story_post_edit } from "server/controller/story";
import { requireUser } from "server/middlewares/requireUser";

const router = Router();

const requirePermission = requireUser({ roles: ["vice"] });

router.get("/story", story_get_random);
router.get("/story/:id", story_get_default);
router.post("/story", requirePermission, story_post_add);
router.patch("/story", requirePermission, story_post_edit);
router.delete("/story", requirePermission, story_post_delete);

export default router;