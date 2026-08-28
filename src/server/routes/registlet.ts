import { RouterInterface } from "@library";
import { Router } from "express";
import { registlet_get_all, registlet_post_add, registlet_post_delete, registlet_post_edit, registlet_search_get} from "server/controller/registlet";
import { requireUser } from "server/middlewares/requireUser";
import upload from "server/multerConfig";

const router = Router();

const requirePermission = requireUser({ roles: ["owner"] });

router.get("/registlet", registlet_search_get);
router.get("/registlet/all", registlet_get_all);
router.post("/registlet", requirePermission, upload.single("image"), registlet_post_add);
router.patch("/registlet", requirePermission, upload.single("image"), registlet_post_edit);
router.delete("/registlet", requirePermission, registlet_post_delete);

export default router;