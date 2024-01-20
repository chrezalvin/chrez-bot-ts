import { Router } from "express";
import { events_add_event, events_get } from "server/controller/events";

const router = Router();

router.get("/events", events_get);
router.get("/events/:monthName", events_get);

router.post("/events/add", events_add_event);

export default router;