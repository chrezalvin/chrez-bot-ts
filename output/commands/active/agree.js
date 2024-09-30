"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const _library_1 = require("../../library");
const agrees_json_1 = require("../../assets/data/agrees.json");
function run(args) {
    if (args?.description !== undefined && args?.description !== "") {
        const embed = new _library_1.MyEmbedBuilder({ title: args.description, description: agrees_json_1.agrees[(0, _library_1.rngInt)(0, agrees_json_1.agrees.length - 1)] });
        return { embeds: [embed] };
    }
    else
        return agrees_json_1.agrees[(0, _library_1.rngInt)(0, agrees_json_1.agrees.length - 1)];
}
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("agree")
    .setDescription("Agrees with you")
    .addStringOption(str => str.setDescription("your message for chrezbot to agree with")
    .setRequired(false)
    .setName("description"));
const agree = new _library_1.CommandBuilder()
    .setName("agree")
    .setAlias(["agrees", "agreed", "approve", "youagree?", "agree?"])
    .setDescription("Agrees with you")
    .setSlash({
    slashCommand,
    getParameter: (interaction) => {
        const description = interaction.options.getString("description", false);
        return { description: description ?? "" };
    },
    interact: async (interaction, args) => {
        const get = run(args);
        if (get instanceof discord_js_1.MessagePayload)
            await interaction.reply(get);
        else if (typeof get === "string")
            await interaction.reply({ content: get });
    }
})
    .setChat({
    getParameter: (message, args) => {
        return { description: args.join(" ") };
    },
    execute: async (message, args) => {
        await message.channel.send(run(args));
    }
});
exports.default = agree;
//# sourceMappingURL=agree.js.map