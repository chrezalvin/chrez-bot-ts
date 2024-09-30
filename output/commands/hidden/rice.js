"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const riceList = [
    "I like rice",
    "Rice is good",
    "Rice is nice",
    "Rice is life",
    "Rice is love",
    "Rice is everything",
];
const hello = new _library_1.CommandBuilder()
    .setName("rice")
    .setAlias([])
    .setDescription("Appreciates rice")
    .setStatus("hidden")
    .setChat({
    execute: async (message) => {
        const rice = riceList[(0, _library_1.rngInt)(0, riceList.length - 1)];
        await message.channel.send(rice);
    },
});
exports.default = hello;
//# sourceMappingURL=rice.js.map