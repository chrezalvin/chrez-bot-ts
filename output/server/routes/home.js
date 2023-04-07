"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/home", (_, res) => {
    res.send("GET /home");
});
router.post("/home", (_, res) => {
    res.send("POST /home");
});
exports.default = router;
