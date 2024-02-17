import { Router } from "express";
import { memes_get } from "server/controller/memes";

const router = Router();

router.get("/memes", memes_get);

export default router;