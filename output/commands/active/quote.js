"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicFunctions_1 = require("../../modules/basicFunctions");
const discord_js_1 = require("discord.js");
const quote_json_1 = __importDefault(require("../../assets/messages/active/quote.json"));
const _config_1 = require("../../config");
const command = {
    name: "quote",
    alias: ["q"],
    description: "Creates a random quote",
    examples: [
        { command: `${_config_1.prefixes[0]} quote`, description: "give random quote" },
        { command: `${_config_1.prefixes[0]} quote 19`, description: "give quote #19" }
    ],
    execute: (message, args) => {
        const embed = new basicFunctions_1.MyEmbedBuilder();
        let index;
        if (args && typeof args[0] === "string" && !isNaN(parseInt(args[0]))) {
            index = parseInt(args[0]);
            if (index >= quote_json_1.default.length)
                throw new Error(`index out of bounds, please choose between 0 to ${quote_json_1.default.length - 1}`);
            if (index < 0)
                throw new Error(`index cannot be negative`);
        }
        else
            index = (0, basicFunctions_1.rngInt)(0, quote_json_1.default.length - 1);
        const quote = quote_json_1.default[index];
        embed.setDescription(quote.description.join("\n"))
            .setTitle(`Quote #${index}`)
            .setFooter({ text: `this quote is made by ${quote.author}` });
        message.channel.send({ embeds: [embed] });
    },
    slash: {
        slashCommand: new discord_js_1.SlashCommandBuilder().setName("quote")
            .setDescription("Creates a random quote, you can specify which quote you want using the option")
            .addIntegerOption(option => option.setName("index").setDescription("Index to target a quote")),
        interact: (interaction) => {
            if (!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = new basicFunctions_1.MyEmbedBuilder();
            let index = interaction.options.getInteger("index", false);
            if (index === null)
                index = (0, basicFunctions_1.rngInt)(0, quote_json_1.default.length - 1);
            else {
                if (index >= quote_json_1.default.length)
                    throw new Error(`index out of bounds, please choose between 0 to ${quote_json_1.default.length - 1}`);
                if (index < 0)
                    throw new Error(`index cannot be negative`);
            }
            const quote = quote_json_1.default[index];
            embed.setDescription(quote.description.join("\n"))
                .setTitle(`Quote #${index}`)
                .setFooter({ text: `this quote is made by ${quote.author}` });
            interaction.reply({ embeds: [embed] });
        }
    }
};
exports.default = command;
