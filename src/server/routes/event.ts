import { Router } from "express";
import { Event } from "@database";
import path from "path";

const router = Router();

interface EventPost{
    
}

function isEventPost(data: unknown): data is EventPost{
    return false;
}

router.get("/event", (_, res) => {
    const p = path.resolve("./static/index.html");
    res.sendFile(p);

    // res.send("GET /Event");
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