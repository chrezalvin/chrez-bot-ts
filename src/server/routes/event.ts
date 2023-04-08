import { Router } from "express";
import { Event } from "@database";

const router = Router();

interface EventPost{

}

function isEventPost(data: unknown): data is EventPost{
    return false;
}

router.get("/event", (_, res) => {
    res.send("GET /Event");
})

router.post("/event", async (req, res) => {
    const data = req.body;
    if(!isEventPost(data)){
        res.json(new Error("data cannot be processed or smthg...."));
        return;
    }

    res.send(`POST /Event ${JSON.stringify(data)}`);
})

export default router;