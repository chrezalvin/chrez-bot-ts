import { Router } from "express";
import { yomama_get_all, yomama_post_add, yomama_post_delete, yomama_post_edit } from "server/controller/yomama";
import { requireUser } from "server/middlewares/requireUser";

const router = Router();

const requirePermission = requireUser({ roles: ["owner"] });

router.get("/yomama", yomama_get_all);
router.post("/yomama", requirePermission, yomama_post_add);
router.delete("/yomama", requirePermission, yomama_post_delete);
router.patch("/yomama", requirePermission, yomama_post_edit);

export default router;