import { RouterInterface } from "@library";
import { Router } from "express";
import { recommend_get_by_id, recommend_get_default, recommend_post_add, recommend_post_delete, recommend_post_update } from "server/controller/recommend";
import { requireUser } from "server/middlewares/requireUser";
import upload from "server/multerConfig";

const router = Router();

const requirePermission = requireUser({ roles: ["owner"] });

router.get("/recommend", recommend_get_default);
router.get("/recommend/:id", recommend_get_by_id);
router.post("/recommend", requirePermission, upload.single("image"), recommend_post_add);
router.patch("/recommend", requirePermission, upload.single("image"), recommend_post_update);
router.delete("/recommend", requirePermission, recommend_post_delete);

export default router;