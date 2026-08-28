import { RouterInterface } from "@library";
import { Router } from "express";
import { update_get, update_get_all, update_post_add, update_get_latest, update_post_delete, update_post_update} from "server/controller/update";
import { requireUser } from "server/middlewares/requireUser";

const router = Router();

const requirePermission = requireUser({ roles: ["owner"] });

router.get("/update", update_get_all);
router.get("/update/latest", update_get_latest);
router.get("/update/:version", update_get);

router.post("/update", requirePermission, update_post_add);
router.delete("/update", requirePermission, update_post_delete);
router.patch("/update", requirePermission, update_post_update);

export default router;