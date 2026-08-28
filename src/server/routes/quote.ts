import { Router } from "express";
import { quote_get_all, quote_get_by_id, quote_post_add, quote_post_delete, quote_post_edit } from "server/controller/quote";
import { requireUser } from "server/middlewares/requireUser";

const router = Router();

router.get("/quote", quote_get_all);
router.get("/quote/:id", quote_get_by_id);
router.post("/quote", requireUser({roles: ["owner"]}), quote_post_add);
router.patch("/quote", requireUser({roles: ["owner"]}), quote_post_edit);
router.delete("/quote", requireUser({roles: ["owner"]}), quote_post_delete);

export default router;