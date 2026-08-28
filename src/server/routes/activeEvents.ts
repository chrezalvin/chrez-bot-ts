import { Router } from "express";
import { activeEvents_get_all, activeEvents_get_by_id, activeEvents_get_incoming, activeEvents_get_ongoing, activeEvents_post_add, activeEvents_post_delete, activeEvents_post_edit } from "server/controller/activeEvents";
import { requireUser } from "server/middlewares/requireUser";
import upload from "server/multerConfig";

const router = Router();

router.get("/activeEvents", activeEvents_get_all);
router.get("/activeEvents/incoming", activeEvents_get_incoming);
router.get("/activeEvents/ongoing", activeEvents_get_ongoing);
router.get("/activeEvents/:id", activeEvents_get_by_id);

router.post("/activeEvents", requireUser({roles: ["owner"]}), upload.single("image"),  activeEvents_post_add);
router.patch("/activeEvents", requireUser({roles: ["owner"]}), upload.single("image"),  activeEvents_post_edit);
router.delete("/activeEvents", requireUser({roles: ["owner"]}), activeEvents_post_delete);

export default router;