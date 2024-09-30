"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command = {
    name: "sad",
    description: "Unsad people",
    searchCriteria: [/^don'?t be sad/i],
    execute: async (message) => {
        await message.channel.send("sad backwards is das and");
        await message.channel.send("das not good");
    },
};
exports.default = command;
//# sourceMappingURL=sad.js.map