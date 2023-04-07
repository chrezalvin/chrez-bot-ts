"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const _config_1 = require("../../config");
const memesDir = path_1.default.resolve(__dirname, "../../assets/images/meme");
const memes = fs_1.default.readdirSync(memesDir);
const command = {
    name: "meme",
    alias: ["memes"],
    description: "Sends you a meme",
    examples: [
        { command: `${_config_1.prefixes[0]} meme`, description: "give random meme" },
        { command: `${_config_1.prefixes[0]} meme 19`, description: "give meme #19" }
    ],
    execute: (message, args) => {
        let index = args === undefined ? NaN : parseInt(args[0]);
        let num;
        if (!isNaN(index)) {
            if (index >= 0 && index < memes.length)
                num = index;
            else
                throw (`index too many! the index is from ${0} to ${memes.length - 1}`);
        }
        else
            num = (0, basicFunctions_1.rngInt)(0, memes.length);
        const attachment = new discord_js_1.AttachmentBuilder(`${memesDir}/${memes[num]}`, { name: `memes.jpg` });
        const myEmbed = new basicFunctions_1.MyEmbedBuilder({ title: `memes #${num}`, footer: { text: "" } }).setImage(`attachment://memes.jpg`);
        message.channel.send({ embeds: [myEmbed], files: [attachment] });
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
            const index = interaction.options.getInteger("index", false);
            let num;
            if (index === null)
                num = (0, basicFunctions_1.rngInt)(0, memes.length - 1);
            else if (index >= memes.length)
                throw new Error(`Index too many, choose between 0 to ${memes.length - 1}`);
            else
                num = index;
            const attachment = new discord_js_1.AttachmentBuilder(`${memesDir}/${memes[num]}`, { name: `memes.jpg` });
            const myEmbed = new basicFunctions_1.MyEmbedBuilder({ title: `memes #${num}`, footer: { text: "" } }).setImage(`attachment://memes.jpg`);
            interaction.reply({ embeds: [myEmbed], files: [attachment] });
        }
    }
};
exports.default = command;
