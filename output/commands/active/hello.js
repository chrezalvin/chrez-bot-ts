"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const hello = new _library_1.CommandBuilder()
    .setName("hello")
    .setDescription("Says hello")
    .setStatus("public")
    .setMode("available")
    .setSlash({
    interact: async (interaction) => {
        await interaction.reply(`Hello, ${interaction.member?.user.username}!`);
    },
})
    .setChat({
    execute: async (message) => {
        await message.channel.send("hi");
    },
});
exports.default = hello;
//# sourceMappingURL=hello.js.map