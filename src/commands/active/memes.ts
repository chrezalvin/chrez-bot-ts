import {MyEmbedBuilder, rngInt} from "@library/basicFunctions";

import { SlashCommandBuilder, AttachmentBuilder, ChannelType, EmbedBuilder, Message, ChatInputCommandInteraction, CacheType } from "discord.js";
import fs from "fs";
import path from "path";
import { CommandBuilder } from "@library/CommandBuilder";
import { prefixes } from "@config";
import { ErrorValidation } from "@library/ErrorValidation";

const sfw_memesDir = path.resolve("./images/meme/sfw");
const nsfw_memesDir = path.resolve("./images/meme/nsfw");

const sfw_memes = fs.readdirSync(sfw_memesDir);
const nsfw_memes = fs.readdirSync(nsfw_memesDir);

// global attachment because it needs to be included when sending too
let attachment: AttachmentBuilder;

const run = (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Memes) => {
    let index: number | null = args?.index ?? rngInt(0, sfw_memes.length - 1);
    let nsfw: boolean = args?.nsfw ?? false;
    
    if(nsfw){
        if(index === null)
            index = rngInt(0, nsfw_memes.length - 1);
        if(message.channel){
            if(message.channel.type === ChannelType.GuildText){
                if(!message.channel.nsfw)
                    return new ErrorValidation("command_restricted", "nsfw meme", "age restricted channel");
                if(index >= nsfw_memes.length)
                    return new ErrorValidation("index_out_of_bounds", 0, nsfw_memes.length - 1);
            }
            else if(message.channel.type === ChannelType.DM){
                // continue
            }
            else 
                return new ErrorValidation("command_restricted", "nsfw meme", "DM or nsfw channel");
        }
        else throw new Error("interaction received is not within a valid channel");
    }
    else{
        if(index === null)
            index = rngInt(0, sfw_memes.length - 1);
        if(index >= sfw_memes.length)
            return new ErrorValidation("index_out_of_bounds", 0, sfw_memes.length - 1);
    }

    if(index < 0)
        return new ErrorValidation("index_negative");
 
    const meme = nsfw ? nsfw_memes[index] : sfw_memes[index];
    attachment = new AttachmentBuilder(`${nsfw ? nsfw_memesDir : sfw_memesDir}/${meme}`, {name: `memes.jpg`});

    const embed = new MyEmbedBuilder({title: `memes #${index}`, footer: {text: ""}}).setImage(`attachment://memes.jpg`);

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
            const index = interaction.options.getInteger("index", false) ?? nsfw ? rngInt(0, nsfw_memes.length - 1) : rngInt(0, sfw_memes.length - 1);

            return {index, nsfw};
        },
        interact: async (interaction, args) => {
            const embeds = run(interaction, args);

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
                index = rngInt(0, (nsfw ? nsfw_memes.length : sfw_memes.length) - 1);

            return {index, nsfw};
        },
        execute: async (message, args) => {
            const embeds = run(message, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await message.channel.send({embeds, files: [attachment]});
        },
    })
    
        
export default memes;