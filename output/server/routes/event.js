"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
function isEventPost(data) {
    return false;
}
router.get("/event", (_, res) => {
    const p = path_1.default.resolve("./static/index.html");
    res.sendFile(p);
    // res.send("GET /Event");
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
