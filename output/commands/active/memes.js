"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customTypes_1 = require("../../typings/customTypes");
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const _config_1 = require("../../config");
const memesDir = path_1.default.resolve(__dirname, "../../assets/images/meme");
const memes = fs_1.default.readdirSync(memesDir);
let attachment;
const run = (message, args) => {
    let index = (0, basicFunctions_1.rngInt)(0, memes.length - 1);
    if ((0, customTypes_1.isChatInputCommandInteraction)(message)) {
        let num = message.options.getInteger("index", false);
        if (num !== null)
            index = num;
    }
    else {
        if (args && args[0] !== undefined) {
            let num = parseInt(args[0]);
            if (!isNaN(num))
                index = num;
        }
    }
    if (index >= memes.length)
        throw new Error(`index out of bounds, please choose between 0 to ${memes.length - 1}`);
    if (index < 0)
        throw new Error(`index cannot be negative`);
    const meme = memes[index];
    attachment = new discord_js_1.AttachmentBuilder(`${memesDir}/${meme}`, { name: `memes.jpg` });
    const embed = new basicFunctions_1.MyEmbedBuilder({ title: `memes #${index}`, footer: { text: "" } }).setImage(`attachment://memes.jpg`);
    return embed;
};
const command = {
    name: "meme",
    alias: ["memes"],
    description: "Sends you a meme",
    examples: [
        { command: `${_config_1.prefixes[0]} meme`, description: "give random meme" },
        { command: `${_config_1.prefixes[0]} meme 19`, description: "give meme #19" }
    ],
    execute: async (message, args) => {
        const embed = run(message, args);
        await message.channel.send({ embeds: [embed], files: [attachment] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("meme")
            .setDescription("Sends you a meme")
            .addIntegerOption(opt => opt
            .setName("index")
            .setDescription("Index to specify which memes you want to see")
            .setMinValue(0))
            .addBooleanOption(opt => opt
            .setName("nsfw")
            .setDescription("(TODO) set if you want nsfw memes, defaults to sfw")),
        interact: (interaction) => {
            if (!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = run(interaction);
            interaction.reply({ embeds: [embed], files: [attachment] });
        }
    }
};
exports.default = command;
