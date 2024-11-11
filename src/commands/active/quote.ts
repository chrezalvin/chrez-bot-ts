import {MyEmbedBuilder, rngInt, getProfileByID, CommandBuilder, ErrorValidation} from "@library";

import { CacheType, ChannelType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import quotes from "@assets/messages/active/quote.json";
import { prefixes } from "@config";
import QuoteService from "@services/quote";
import { Quote } from "@models";

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Quote) => {
    if(!message.channel || message.channel.type !== ChannelType.GuildText)
        return new ErrorValidation("command_restricted", "quote", "guild text channel");

    // let index: number = args?.index ?? rngInt(0, quotes.length - 1);

    // if(index >= quotes.length)
    //     return new ErrorValidation("index_out_of_bounds", 0, quotes.length - 1);
    // if(index < 0)
    //     return new ErrorValidation("index_negative");

    const embed = new MyEmbedBuilder();

    let quote: Quote | undefined;
    if(args?.index){
        try{
            quote = await QuoteService.getQuoteById(args.index);
        }
        catch(e){
            return new ErrorValidation("something_not_found", "quote");
        }
    }
    else 
        quote = await QuoteService.getRandomQuote(args?.isNsfw ?? undefined);

    if(!quote)
        return new ErrorValidation("something_not_found", "quote");

    if(quote.nsfw && !message.channel.nsfw)
        return new ErrorValidation("forbidden", "quote is nsfw");

    if(quote.memberRef){
        const member = getProfileByID(quote.memberRef);
        embed.setDescription(quote.description.join("\n"))
            .setAuthor({name: quote.author, iconURL: `https://cdn.discordapp.com/avatars/${quote.memberRef}/${member?.avatarID}.webp`})
            .setFooter({text: `quote #${quote.id}`});
    }
    else{
        embed.setDescription(quote.description.join("\n"))
            .setTitle(`Quote #${quote.id}`)
            .setFooter({text: `this quote is made by ${quote.author}`});
    }

    return [embed];
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
        {command: `${prefixes[0]} quote`, description: "give random quote"},
        {command: `${prefixes[0]} quote 19`, description: "give quote #19"}
    ])
    .setSlash({
        slashCommand: new SlashCommandBuilder().setName("quote")
            .setDescription("Creates a random quote, you can specify which quote you want using the option")
            .addIntegerOption(option => 
                option
                .setName("index")
                .setDescription("Index to target a quote")
                )
            .addBooleanOption(option => option
                .setName("nsfw")
                .setDescription("Get nsfw quote")
                .setRequired(false)
            ),
        interact: async (interaction, args) => {
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.reply({embeds});
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

            await message.channel.send({embeds});
        },
    })

export default quote;