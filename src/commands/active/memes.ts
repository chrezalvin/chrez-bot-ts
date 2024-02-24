import {MyEmbedBuilder, rngInt, CommandBuilder, ErrorValidation} from "@library";

import { SlashCommandBuilder, AttachmentBuilder, ChannelType, Message, ChatInputCommandInteraction, CacheType } from "discord.js";
import { prefixes } from "@config";
import { getMemeUrl, memeListNsfw, memeListSfw } from "services/memes";

// global attachment because it needs to be included when sending too
let attachment: AttachmentBuilder;

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Memes) => {
    const sfw_memes_length = memeListSfw.length;
    const nsfw_memes_length = memeListNsfw.length;

    const nsfw: boolean = args?.nsfw ?? false;
    let index: number | null = args?.index ?? (nsfw ? rngInt(0, nsfw_memes_length - 1) : rngInt(0, sfw_memes_length - 1));

    // checks if the channel is nsfw
    if(nsfw){
        if(message.channel){
            if(message.channel.type === ChannelType.GuildText && !message.channel.nsfw)
                return new ErrorValidation("command_restricted", "nsfw meme", "age restricted channel");
            else if(message.channel.type === ChannelType.DM){
                // continue
            }
            else 
                return new ErrorValidation("command_restricted", "nsfw meme", "DM or nsfw channel");
        }
        else throw new Error("interaction received is not within a valid channel");
    }

    // checks for out of bounds error
    if(index < 0)
        return new ErrorValidation("index_negative");
    if(nsfw && index >= nsfw_memes_length)
        return new ErrorValidation("index_out_of_bounds", 0, nsfw_memes_length - 1);
    else if(index >= sfw_memes_length)
        return new ErrorValidation("index_out_of_bounds", 0, sfw_memes_length - 1);

    const url = await getMemeUrl(index, nsfw);

    attachment = new AttachmentBuilder(url, {name: `memes.jpg`});

    const embed = new MyEmbedBuilder({title: `meme#${index}`}).setImage(`attachment://memes.jpg`);

    return [embed];
}

const slashCommand = new SlashCommandBuilder().setName("meme")
    .setDescription("Sends you a meme")
    .addIntegerOption(opt => opt
        .setName("index")
        .setDescription("Index to specify which memes you want to see")
        .setMinValue(0)
    )
    .addBooleanOption(opt => opt
        .setName("nsfw")
        .setDescription("(TODO) set if you want nsfw memes, defaults to sfw")
    )

interface I_Memes{
    index: number;
    nsfw: boolean;
}

const memes = new CommandBuilder<I_Memes>()
    .setName("meme")
    .setAlias(["memes"])
    .setDescription("Sends you a meme")
    .setStatus("public")
    .setMode("available")
    .setExamples([
        {command: `${prefixes[0]} meme`, description: "give random meme"},
        {command: `${prefixes[0]} meme 19`, description: "give meme #19"}
    ])
    .setSlash({
        slashCommand,
        getParameter: (interaction) => {
            const nsfw = interaction.options.getBoolean("nsfw", false) ?? false;
            const index = interaction.options.getInteger("index", false) ?? nsfw ? rngInt(0, memeListNsfw.length - 1) : rngInt(0, memeListSfw.length - 1);

            return {index, nsfw};
        },
        interact: async (interaction, args) => {
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.reply({embeds, files: [attachment]});
        },
    })
    .setChat({
        getParameter: (_, args) => {
            let nsfw: boolean = false;
            let index: number = -1;

            // possible args:
            // Chrez meme 16 nsfw
            // Chrez meme nsfw 16
            // Chrez meme nsfw
            // Chrez meme 16
            args.find((arg) => arg === "nsfw" ? nsfw = true : false);
            args.find((arg) => {
                const num = parseInt(arg);
                if(!isNaN(num)){
                    index = num;
                    return true;
                }
                return false;
            });

            if(index === -1)
                index = rngInt(0, (nsfw ? memeListNsfw.length : memeListSfw.length) - 1);

            return {index, nsfw};
        },
        execute: async (message, args) => {
            const embeds = await run(message, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await message.channel.send({embeds, files: [attachment]});
        },
    })
    
        
export default memes;