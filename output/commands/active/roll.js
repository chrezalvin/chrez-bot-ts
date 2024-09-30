"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
const run = (args) => {
    const rng = (0, _library_1.rngInt)(args.first, args.second);
    const embed = new _library_1.MyEmbedBuilder();
    if (args.first === 1 && args.second === 6)
        embed
            .setTitle("rolls a die")
            .setDescription(`I rolled a die and got ${rng}`);
    else
        embed
            .setTitle(`rolls a number between ${args.first} and ${args.second}`)
            .setDescription(`I rolled a ${rng}!`);
    return [embed];
};
const slashCommand = new discord_js_1.SlashCommandBuilder().setName("roll")
    .setDescription("rolls a number between 2 numbers, rolls a die otherwise")
    .addIntegerOption(option => option.setName("first").setDescription("First Number"))
    .addIntegerOption(option => option.setName("second").setDescription("Second Number"));
const roll = new _library_1.CommandBuilder()
    .setName("roll")
    .setAlias(["dice", "random", "rng"])
    .setDescription("rolls a number between 2 numbers, rolls a die otherwise")
    .setStatus("public")
    .setMode("available")
    .setExamples([
    { command: `${_config_1.prefixes[0]} roll`, description: "rolls a dice" },
    { command: `${_config_1.prefixes[0]} roll 1 20`, description: "rolls a number between 1 and 20" },
    { command: `${_config_1.prefixes[0]} roll 30 20`, description: "rolls a number between 30 and 20" },
])
    .setSlash({
    slashCommand,
    interact: async (interaction, args) => {
        if (!args)
            throw new Error("argument is not provided");
        const embeds = run(args);
        await interaction.reply({ embeds });
    },
    getParameter: (interaction) => {
        const first = interaction.options.getInteger("first", false);
        const second = interaction.options.getInteger("second", false);
        if (first !== null && second !== null)
            return { first, second };
        if (first === null && second === null)
            return { first: 1, second: 6 };
        else {
            if (first === null)
                throw new Error("the first number should be inputted too");
            else if (second === null)
                throw new Error("the second number should be inputted too");
            else
                throw new Error("unknown error");
        }
    }
})
    .setChat({
    getParameter: (_, args) => {
        // check if the first and second argument exist
        const a = args[0];
        const b = args[1];
        if (a === undefined && b === undefined)
            return { first: 1, second: 6 };
        if (isNaN(parseInt(a)))
            throw new Error("the first argument should be a number");
        if (b === undefined)
            throw new Error("the second number should be inputted too");
        if (isNaN(parseInt(b)))
            throw new Error("the second argument should be a number");
        // now we know that both a and b is a number
        return { first: parseInt(a), second: parseInt(b) };
    },
    execute: async (message, args) => {
        if (!args)
            throw new Error("argument is not provided");
        const embeds = run(args);
        await message.channel.send({ embeds });
    }
});
exports.default = roll;
//# sourceMappingURL=roll.js.map