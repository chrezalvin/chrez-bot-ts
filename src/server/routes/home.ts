import { Router } from "express";

const router = Router();

router.get("/home", (_, res) => {
    res.send("GET /home");
})

router.post("/home", (_, res) => {
    res.send("POST /home");
})

export default router;