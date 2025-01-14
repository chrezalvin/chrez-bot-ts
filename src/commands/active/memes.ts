import {MyEmbedBuilder, rngInt, CommandBuilder, ErrorValidation} from "@library";

import { SlashCommandBuilder, ChannelType, Message, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BOT_PREFIXES } from "@config";
import { MemeService } from "@services";

const run = async (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Memes) => {
    const sfw_memes_length = MemeService.fileManagerSfw.cache.length;
    const nsfw_memes_length = MemeService.fileManagerNsfw.cache.length;

    const nsfw: boolean = args?.nsfw ?? false;
    let index: number = args?.index ?? rngInt(0, (nsfw ? nsfw_memes_length : sfw_memes_length) - 1);

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

    const url = await MemeService.getMemeUrl(nsfw, index);

    const embed = new MyEmbedBuilder({title: `meme#${index}`}).setImage(url);

    return [embed];
}

const slashCommand = new SlashCommandBuilder()
    .setName("meme")
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
        {command: `${BOT_PREFIXES[0]} meme`, description: "give random meme"},
        {command: `${BOT_PREFIXES[0]} meme 19`, description: "give meme #19"}
    ])
    .setSlash({
        slashCommand,
        getParameter: (interaction) => {
            const sfw_memes_length = MemeService.fileManagerSfw.cache.length;
            const nsfw_memes_length = MemeService.fileManagerNsfw.cache.length;

            const nsfw = interaction.options.getBoolean("nsfw", false) ?? false;
            const index = interaction.options.getInteger("index", false) ?? rngInt(0, (nsfw ? nsfw_memes_length : sfw_memes_length) - 1);

            return {index, nsfw};
        },
        interact: async (interaction, args) => {
            await interaction.deferReply();
            const embeds = await run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.editReply({embeds});
        },
    })
    .setChat({
        getParameter: (_, args) => {
            let nsfw: boolean = false;
            let index: number = -1;
            const sfw_memes_length = MemeService.fileManagerSfw.cache.length;
            const nsfw_memes_length = MemeService.fileManagerNsfw.cache.length;

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
                index = rngInt(0, (nsfw ? nsfw_memes_length : sfw_memes_length) - 1);

            return {index, nsfw};
        },
        execute: async (message, args) => {
            const embeds = await run(message, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await message.channel.send({embeds});
        },
    })
    
        
export default memes;