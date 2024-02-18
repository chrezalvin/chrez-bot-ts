import { asyncErrorHandler } from "@library/server";
import { Router } from "express";
import { update_get, update_get_all, update_post_add } from "server/controller/update";

const router = Router();

router.post("/update/add", asyncErrorHandler(update_post_add));

router.get("/update", asyncErrorHandler(update_get_all));
router.get("/update/:version", asyncErrorHandler(update_get));

export default router;