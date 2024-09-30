"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.rng = exports.rngInt = exports.MyEmbedBuilder = void 0;
const _config_1 = require("../config");
const discord_js_1 = require("discord.js");
class MyEmbedBuilder extends discord_js_1.EmbedBuilder {
    constructor(data) {
        super(data);
        if (!this.data.color)
            this.setColor("Yellow");
    }
    setError(data) {
        this.data.title = data.title ?? ":warning:     error   :warning:";
        this.data.description = data.description;
        this.data.footer = { text: data.footer ?? `for command list, type ${_config_1.prefixes[0]} help!` };
        this.setColor("Red");
        return this;
    }
}
exports.MyEmbedBuilder = MyEmbedBuilder;
function rngInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (Math.abs(max - min) + 1)) + Math.min(min, max);
}
exports.rngInt = rngInt;
function rng(min, max) {
    return Math.random() * Math.abs(max - min) + Math.min(max, min);
}
exports.rng = rng;
async function sleep(ms) {
    return new Promise((res, _) => {
        setTimeout(() => { res(); }, ms);
    });
}
exports.sleep = sleep;
