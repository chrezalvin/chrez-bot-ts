"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
function isEventPost(data) {
    return false;
}
router.get("/event", (_, res) => {
    res.send("GET /Event");
});
router.post("/event", async (req, res) => {
    const data = req.body;
    if (!isEventPost(data)) {
        res.json(new Error("data cannot be processed or smthg...."));
        return;
    }
    res.send(`POST /Event ${JSON.stringify(data)}`);
});
exports.default = router;
