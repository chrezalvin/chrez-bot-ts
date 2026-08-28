import { RouterInterface } from "@library";
import { Router } from "express";
import { events_add_event, events_get, events_get_all } from "server/controller/events";
import { requireUser } from "server/middlewares/requireUser";

const router = Router();

router.get("/events", events_get);
router.post("/events", requireUser({roles: ["owner"]}), events_add_event);

export default router;