"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const _library_1 = require("../../library");
const _config_1 = require("../../config");
const run = (args) => {
    let flagMute = args?.mute ?? true;
    const embed = new _library_1.MyEmbedBuilder();
    if (flagMute == _config_1.muted)
        embed.setDescription(`Chrezbot is already ${_config_1.muted ? "muted" : "unmuted"}`);
    else {
        (0, _config_1.setMute)(flagMute, flagMute ? args?.onUnmuted
            : undefined);
        embed.setTitle(`Chrezbot has been ${flagMute ? "muted" : "unmuted"}!`);
        if (flagMute)
            embed.setDescription("Inline command have been muted for 10 minutes");
    }
    return [embed];
};
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("mute")
    .setDescription("mutes chrezbot")
    .addBooleanOption(input => input.setName("global")
    .setDescription("if this is true, chrezbot will be muted for all users")
    .setRequired(false))
    .addNumberOption(input => input.setName("duration")
    .setDescription("how long chrezbot will be muted in minutes (20 minutes if left empty)")
    .setRequired(false));
const mute = new _library_1.CommandBuilder()
    .setName("mute")
    .setDescription("mutes chrezbot's inline command")
    .setAlias(["stfu", "shutup", "off", "shoo", "sshh"])
    .setSlash({
    slashCommand,
    getParameter: (interaction) => {
        const mute = interaction.options.getBoolean("mute", true);
        const onUnmuted = () => {
            if (interaction.channel?.isSendable())
                interaction.channel?.send({ embeds: [new _library_1.MyEmbedBuilder({ description: "Chrezbot is now unmuted" })] });
        };
        return {
            mute,
            onUnmuted
        };
    },
    interact: async (interaction, args) => {
        const res = run(args);
        await interaction.reply({ embeds: res });
    }
})
    .setChat({
    getParameter: (message, args) => {
        const muted = args[0] === "false" ? false : true;
        const onUnmuted = () => {
            message.channel.send({ embeds: [new _library_1.MyEmbedBuilder({ description: "Chrezbot is now unmuted" })] });
        };
        return {
            mute: muted,
            onUnmuted
        };
    },
    execute: async (message, args) => {
        const res = run(args);
        await message.channel.send({ embeds: res });
    }
});
exports.default = mute;
//# sourceMappingURL=setmute.js.map