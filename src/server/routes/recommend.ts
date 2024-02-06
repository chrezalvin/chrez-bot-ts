import { Router } from "express";
import { recommend_get_by_id, recommend_get_default, recommend_post_add, recommend_post_delete, recommend_post_update } from "server/controller/recommend";

const router = Router();

router.get("/recommend", recommend_get_default);
router.get("/recommend/:id", recommend_get_by_id);
router.post("/recommend/add", recommend_post_add);
router.post("/recommend/delete", recommend_post_delete);
router.post("/recommend/update", recommend_post_update);

export default router;