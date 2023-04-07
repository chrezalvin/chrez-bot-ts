import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
    res.send("GET /");
})

router.post("/", (_, res) => {
    res.send("POST /");
})

export default router;