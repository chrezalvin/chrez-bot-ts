import { Router } from "express";
import { cursed_get } from "server/controller/cursed";

const router = Router();

router.get("/cursed", cursed_get);
router.get("/cursed/:index", cursed_get);

export default router;