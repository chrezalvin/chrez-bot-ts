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
// import curseds from "./memes";
const cursedDir = path_1.default.resolve(__dirname, "../../assets/images/cursed");
const curseds = fs_1.default.readdirSync(cursedDir);
let attachment;
const run = (message, args) => {
    let index = (0, basicFunctions_1.rngInt)(0, curseds.length - 1);
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
    if (index >= curseds.length)
        throw new Error(`index out of bounds, please choose between 0 to ${curseds.length - 1}`);
    if (index < 0)
        throw new Error(`index cannot be negative`);
    const meme = curseds[index];
    attachment = new discord_js_1.AttachmentBuilder(`${cursedDir}/${meme}`, { name: `cursed.jpg` });
    const embed = new basicFunctions_1.MyEmbedBuilder({ title: `cursed #${index}`, footer: { text: "" } }).setImage(`attachment://cursed.jpg`);
    return embed;
};
const command = {
    name: "cursed",
    alias: ["curse", "cringe"],
    description: "Sends you a really cursed image",
    examples: [
        { command: `${_config_1.prefixes[0]} curse`, description: "give random cursed image" },
        { command: `${_config_1.prefixes[0]} curse 19`, description: "give cursed image #19" }
    ],
    execute: (message, args) => {
        const embed = run(message, args);
        message.channel.send({ embeds: [embed], files: [attachment] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("cursed")
            .setDescription("Sends you a really cursed image")
            .addIntegerOption(opt => opt
            .setName("index")
            .setDescription("Index to specify which cursed image you want to see")
            .setMinValue(0))
            .addBooleanOption(opt => opt
            .setName("nsfw")
            .setDescription("(TODO) set if you want nsfw image, defaults to sfw")),
        interact: (interaction) => {
            if (!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = run(interaction);
            interaction.reply({ embeds: [embed], files: [attachment] });
        }
    }
};
exports.default = command;
