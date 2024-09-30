"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandBuilder_1 = require("../../library/CommandBuilder");
const basicFunctions_1 = require("../../library/basicFunctions");
const cryList = [
    "T_T",
    "T.T",
    "T-T",
    "\*cries\*",
    "\*cries in the corner\*",
    "I'm not crying, you are!",
];
const hello = new CommandBuilder_1.CommandBuilder()
    .setName("cry")
    .setDescription("Cries to chat")
    .setStatus("hidden")
    .setChat({
    execute: async (message) => {
        const cry = cryList[(0, basicFunctions_1.rngInt)(0, cryList.length - 1)];
        await message.channel.send(cry);
    },
});
exports.default = hello;
