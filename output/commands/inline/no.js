"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const nos = [
    ":(",
    "oh ok",
    "okay :(",
    "D:",
    "oh well",
    "oh",
    "I see",
    "I understand",
];
const command = {
    name: "no",
    searchCriteria: [/^no$/i, /^i refuse$/i],
    description: "responds to user saying no to reply",
    execute: async (message) => {
        const no = nos[(0, _library_1.rngInt)(0, nos.length - 1)];
        if (message.type === discord_js_1.MessageType.Reply) {
            const repliedMessage = await message.fetchReference();
            if (repliedMessage.author.id === message.client.user?.id)
                await message.reply(no);
        }
    }
};
exports.default = command;
//# sourceMappingURL=no.js.map