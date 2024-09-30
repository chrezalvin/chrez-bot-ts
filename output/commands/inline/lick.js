"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const lick_1 = require("../../services/lick");
const arrayOfFunctions = [
    async () => {
        const lickUrl = await lick_1.LickService.getLickUrl();
        const attachment = new discord_js_1.AttachmentBuilder(lickUrl, { name: "licks.jpg" });
        const embed = new _library_1.MyEmbedBuilder({ title: "licks", footer: { text: "" } }).setImage("attachment://licks.jpg");
        return { embeds: [embed], files: [attachment] };
    },
    "ahh.....",
    "nghh...",
    "ahh... so good...",
    "tasty",
    "yum"
];
const command = {
    name: "lick",
    searchCriteria: ["lick", /^lick(s) \w{1,6}$/i, /^(licks? ?){1,3}/i],
    description: "lick stuffs",
    execute: async (message) => {
        const strOrFunc = arrayOfFunctions[(0, _library_1.rngInt)(0, arrayOfFunctions.length - 1)];
        message.channel.send(typeof strOrFunc === "string" ? strOrFunc : await strOrFunc());
    }
};
exports.default = command;
//# sourceMappingURL=lick.js.map