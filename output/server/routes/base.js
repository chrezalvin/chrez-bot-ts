"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profiles_json_1 = __importDefault(require("../../assets/data/profiles.json"));
const router = (0, express_1.Router)();
router.get("/", (_, res) => {
    const a = profiles_json_1.default;
    res.json(profiles_json_1.default);
});
router.post("/", (_, res) => {
    res.json(profiles_json_1.default);
});
exports.default = router;
