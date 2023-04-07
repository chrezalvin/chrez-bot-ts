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
const cursedDir = path_1.default.resolve(__dirname, "../../assets/images/cursed");
const curseds = fs_1.default.readdirSync(cursedDir);
const command = {
    name: "cursed",
    alias: ["curse", "cringe"],
    description: "Sends you a really cursed image",
    examples: [
        { command: `${_config_1.prefixes[0]} curse`, description: "give random cursed image" },
        { command: `${_config_1.prefixes[0]} curse 19`, description: "give cursed image #19" }
    ],
    execute: (message, args) => {
        let index = args === undefined ? NaN : parseInt(args[0]);
        let num;
        if (!isNaN(index)) {
            if (index >= 0 && index < curseds.length)
                num = index;
            else
                throw (`index too many! the index is from ${0} to ${curseds.length - 1}`);
        }
        else
            num = (0, basicFunctions_1.rngInt)(0, curseds.length);
        const attachment = new discord_js_1.AttachmentBuilder(`${cursedDir}/${curseds[num]}`, { name: `cursed.jpg` });
        const myEmbed = new basicFunctions_1.MyEmbedBuilder({ title: `cursed #${num}`, footer: { text: "" } }).setImage(`attachment://cursed.jpg`);
        message.channel.send({ embeds: [myEmbed], files: [attachment] });
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
            const index = interaction.options.getInteger("index", false);
            let num;
            if (index === null)
                num = (0, basicFunctions_1.rngInt)(0, curseds.length - 1);
            else if (index >= curseds.length)
                throw new Error(`Index too many, choose between 0 to ${curseds.length - 1}`);
            else
                num = index;
            const attachment = new discord_js_1.AttachmentBuilder(`${cursedDir}/${curseds[num]}`, { name: `cursed.jpg` });
            const myEmbed = new basicFunctions_1.MyEmbedBuilder({ title: `cursed #${num}`, footer: { text: "" } }).setImage(`attachment://cursed.jpg`);
            interaction.reply({ embeds: [myEmbed], files: [attachment] });
        }
    }
};
exports.default = command;
