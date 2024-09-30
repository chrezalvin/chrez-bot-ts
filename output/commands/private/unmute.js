"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const _library_1 = require("../../library");
const _config_1 = require("../../config");
const run = () => {
    const embed = new _library_1.MyEmbedBuilder();
    if (!_config_1.muted)
        embed.setDescription(`Chrezbot is already unmuted`);
    else {
        (0, _config_1.setMute)(false);
        embed.setTitle(`Chrezbot has been unmuted!`);
    }
    return [embed];
};
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("unmute")
    .setDescription("unmutes chrezbot");
const unmute = new _library_1.CommandBuilder()
    .setName("unmute")
    .setDescription("mutes chrezbot")
    .setAlias(["rise", "on"])
    .setSlash({
    slashCommand,
    interact: async (interaction) => {
        const res = run();
        await interaction.reply({ embeds: res });
    }
})
    .setChat({
    execute: async (message) => {
        const res = run();
        await message.channel.send({ embeds: res });
    }
});
exports.default = unmute;
//# sourceMappingURL=unmute.js.map