import { Request, Router } from "express";
import profiles from "@assets/data/profiles.json";

const router = Router();

router.get("/", (_: Request, res) => {
    const a = profiles;
    res.json(profiles);
})

router.post("/", (_, res) => {
    res.json(profiles);
})

export default router;