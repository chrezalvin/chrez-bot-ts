"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const discord_js_1 = require("discord.js");
const _config_1 = require("../../config");
const _services_1 = require("../../services");
const run = async (args) => {
    const length = _services_1.StoryService.serviceSupabase.length;
    let index = args?.index ?? (0, _library_1.rngInt)(0, length - 1);
    if (index >= length)
        return new _library_1.ErrorValidation("index_out_of_bounds", 0, length - 1);
    if (index < 0)
        return new _library_1.ErrorValidation("index_negative");
    const story = await _services_1.StoryService.getStory(index);
    // const story = stories[index];
    const embeds = [];
    const sentences = [];
    let flagTitle = false;
    for (let iii = 0, count = 0; iii < story.description.length; ++iii) {
        sentences.push(story.description[iii]);
        count += story.description[iii].length;
        if (count > 2000) {
            embeds.push(new _library_1.MyEmbedBuilder()
                .setDescription(sentences.splice(0, sentences.length).join('\n\n'))
                .setTitle(!flagTitle ? `${story.title} by ${story.author}` : null));
            count = 0;
            flagTitle = true;
        }
    }
    embeds.push(new _library_1.MyEmbedBuilder()
        .setDescription(sentences.join("\n\n"))
        .setTitle(!flagTitle ? `${story.title} by ${story.author}` : null)
        .setFooter(story.footer ? { text: story.footer } : null));
    return embeds;
};
const story = new _library_1.CommandBuilder()
    .setName("story")
    .setAlias(["s"])
    .setDescription("Creates a random story")
    .setExamples([
    { command: `${_config_1.prefixes[0]} story`, description: "give random story" },
    { command: `${_config_1.prefixes[0]} story 3`, description: "give story #3" }
])
    .setSlash({
    slashCommand: new discord_js_1.SlashCommandBuilder().setName("story")
        .setDescription("Creates a random story, you can specify which story you want using the option")
        .addIntegerOption(option => option.setName("index").setDescription("Index to target a story")),
    interact: async (interaction, args) => {
        const embeds = await run(args);
        if (_library_1.ErrorValidation.isErrorValidation(embeds))
            return embeds;
        await interaction.reply({ embeds });
    },
    getParameter: (interaction) => {
        const index = interaction.options.getInteger("index", false) ?? (0, _library_1.rngInt)(0, _services_1.StoryService.serviceSupabase.length - 1);
        return { index };
    }
})
    .setChat({
    getParameter: (_, args) => {
        let index = (0, _library_1.rngInt)(0, _services_1.StoryService.serviceSupabase.length - 1);
        if (args && args[0] !== undefined) {
            let num = parseInt(args[0]);
            if (!isNaN(num))
                index = num;
        }
        return { index };
    },
    execute: async (message, args) => {
        const embeds = await run(args);
        if (_library_1.ErrorValidation.isErrorValidation(embeds))
            return embeds;
        for (const embed of embeds)
            await message.channel.send({ embeds: [embed] });
    },
});
exports.default = story;
//# sourceMappingURL=story.js.map