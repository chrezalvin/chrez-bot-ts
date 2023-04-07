import {CommandReturnTypes} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder } from "discord.js";
import quotes from "@assets/messages/active/quote.json";
import { prefixes } from "@config";

const command: CommandReturnTypes = {
    name: "quote",
    alias: ["q"],
    description: "Creates a random quote",
    examples: [
        {command: `${prefixes[0]} quote`, description: "give random quote"},
        {command: `${prefixes[0]} quote 19`, description: "give quote #19"}
    ],
    execute: (message, args) => {
        const embed = new MyEmbedBuilder();

        let index: number;
        if(args && typeof args[0] === "string" && !isNaN(parseInt(args[0]))){
            index = parseInt(args[0]);
            if(index >= quotes.length)
                throw new Error(`index out of bounds, please choose between 0 to ${quotes.length - 1}`);
            if(index < 0)
                throw new Error(`index cannot be negative`);
        }
        else
            index = rngInt(0, quotes.length - 1);

        const quote = quotes[index];
        embed.setDescription(quote.description.join("\n"))
            .setTitle(`Quote #${index}`)
            .setFooter({text: `this quote is made by ${quote.author}`});
        message.channel.send({embeds: [embed]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("quote")
            .setDescription("Creates a random quote, you can specify which quote you want using the option")
            .addIntegerOption(option => option.setName("index").setDescription("Index to target a quote")),
        interact: (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embed = new MyEmbedBuilder();

            let index = interaction.options.getInteger("index", false);

            if(index === null)
                index = rngInt(0, quotes.length - 1);
            else{
                if(index >= quotes.length)
                    throw new Error(`index out of bounds, please choose between 0 to ${quotes.length - 1}`);
                if(index < 0)
                    throw new Error(`index cannot be negative`);
            }

            const quote = quotes[index];
            embed.setDescription(quote.description.join("\n"))
                .setTitle(`Quote #${index}`)
                .setFooter({text: `this quote is made by ${quote.author}`});
            interaction.reply({embeds: [embed]});
        }
    }
};

export default command;