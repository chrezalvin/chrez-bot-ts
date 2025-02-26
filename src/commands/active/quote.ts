import {MyEmbedBuilder, rngInt, getProfileByID, CommandBuilder, ErrorValidation} from "@library";

import { CacheType, ChannelType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import quotes from "@assets/messages/active/quote.json";
import { BOT_PREFIXES } from "@config";
import QuoteService from "@services/quote";
import { Quote } from "@models";

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Quote) => {
    if(!message.channel || message.channel.type !== ChannelType.GuildText)
        return new ErrorValidation("command_restricted", "quote", "guild text channel");

    const embed = new MyEmbedBuilder();

    let quote: Quote | undefined;
    if(args?.index)
        quote = await QuoteService.getQuoteById(args.index);
    else 
        quote = await QuoteService.getRandomQuote(true);

    if(!quote)
        return new ErrorValidation("something_not_found", "quote");

    embed.setDescription(quote.nsfw ?  `||${quote.description.join("\n")}||` : quote.description.join("\n"))

    if(quote.memberRef){
        const member = getProfileByID(quote.memberRef);
        embed.setAuthor({name: quote.author, iconURL: `https://cdn.discordapp.com/avatars/${quote.memberRef}/${member?.avatarID}.webp`})
    }

    embed.setFooter({text: `quote #${quote.quote_id}`});

    return {embeds: [embed], content: quote.nsfw ? "this quote is spoilered because it's NSFW" : undefined};
}

interface I_Quote{
    index?: number;
    isNsfw: boolean | null;
};

const quote = new CommandBuilder<I_Quote>()
    .setName("quote")
    .setAlias(["q"])
    .setDescription("Creates a random quote")
    .setExamples([
        {command: `${BOT_PREFIXES[0]} quote`, description: "give random quote"},
        {command: `${BOT_PREFIXES[0]} quote 19`, description: "give quote #19"}
    ])
    .setSlash({
        slashCommand: new SlashCommandBuilder().setName("quote")
            .setDescription("Creates a random quote, you can specify which quote you want using the option")
            .addIntegerOption(option => 
                option
                .setName("index")
                .setDescription("Index to target a quote")
                ),
        interact: async (interaction, args) => {
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.reply(embeds);
        },
        getParameter(interaction) {
            const getOpt = interaction.options.getInteger("index", false) ?? rngInt(0, quotes.length - 1);
            const nsfw = interaction.options.getBoolean("nsfw", false);

            return {index: getOpt, isNsfw: nsfw};
        }
    })
    .setChat({
        getParameter(_, args) {
            let index: number | undefined = undefined;
            if(args && !isNaN(parseInt(args[0])))
                index = parseInt(args[0]);

            if(args[0] === "nsfw")
                return {isNsfw: true};
            else
                return {index, isNsfw: null};
        },
        execute: async (message, args) => {
            const embeds = await run(message, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await message.channel.send(embeds);
        },
    })

export default quote;