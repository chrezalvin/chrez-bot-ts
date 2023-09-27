const debug = require("debug")("ChrezBot:memes");

import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder, AttachmentBuilder, ChannelType } from "discord.js";
import fs from "fs";
import path from "path";
import { prefixes } from "@config";

const sfw_memesDir = path.resolve("./images/meme/sfw");
const nsfw_memesDir = path.resolve("./images/meme/nsfw");

const sfw_memes = fs.readdirSync(sfw_memesDir);
const nsfw_memes = fs.readdirSync(nsfw_memesDir);

// global attachment because it needs to be included when sending too
let attachment: AttachmentBuilder;

const run: runCommand = (message , args?: string[]) => {
    let index: number | null = null;
    let nsfw: boolean = false;
    
    if(isChatInputCommandInteraction(message)){
        // interaction
        let num = message.options.getInteger("index", false);
        nsfw = message.options.getBoolean("nsfw", false) ?? false;

        debug(`running command /memes index: ${num ?? "null"} nsfw: ${nsfw ?? "null"}`);
        
        if(num !== null)
            index = num;
    }
    else{
        // message
        debug(`running command ${prefixes[0]} memes ${args !== undefined ? args.join(' '): ""}`);

        if(args && args[0] !== undefined){
            // index check
            let num = parseInt(args[0]);
            
            // nsfw on first args check
            nsfw = args[0] === "nsfw";
            
            if(!isNaN(num))
                index = num;
            
            // nsfw args
            if(args[1] !== undefined && !nsfw)
                nsfw = args[1] === "nsfw";
        }
    }
    
    if(nsfw){
        if(index === null)
            index = rngInt(0, nsfw_memes.length - 1);
        if(message.channel){
            if(message.channel.type === ChannelType.GuildText){
                if(!message.channel.nsfw)
                    throw new Error("I can only send nsfw memes in age restricted channel");
                if(index >= nsfw_memes.length)
                    throw new Error(`index out of bounds, please choose between 0 to ${nsfw_memes.length - 1}`);
            }
            else if(message.channel.type === ChannelType.DM){
                // continue
            }
            else throw new Error("I can only send nsfw memes in DM or nsfw channel");
        }
        else throw new Error("interaction received is not within a valid channel");
    }
    else{
        if(index === null)
            index = rngInt(0, sfw_memes.length - 1);
        if(index >= sfw_memes.length)
            throw new Error(`index out of bounds, please choose between 0 to ${sfw_memes.length - 1}`);
    }

    if(index < 0)
        throw new Error(`index cannot be negative`);
 
    const meme = nsfw ? nsfw_memes[index] : sfw_memes[index];
    attachment = new AttachmentBuilder(`${nsfw ? nsfw_memesDir : sfw_memesDir}/${meme}`, {name: `memes.jpg`});
    console.log(attachment);

    const embed = new MyEmbedBuilder({title: `memes #${index}`, footer: {text: ""}}).setImage(`attachment://memes.jpg`);
    
    return [embed];
}

const command: CommandReturnTypes = {
    name: "meme",
    alias: ["memes"],
    description: "Sends you a meme",
    examples: [
        {command: `${prefixes[0]} meme`, description: "give random meme"},
        {command: `${prefixes[0]} meme 19`, description: "give meme #19"}
    ],
    execute: async (message, args) => {
        const embeds = run(message, args);
        
        await message.channel.send({embeds, files: [attachment]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("meme")
        .setDescription("Sends you a meme")
        .addIntegerOption(opt => opt
            .setName("index")
            .setDescription("Index to specify which memes you want to see")
            .setMinValue(0))
            .addBooleanOption(opt => opt
                .setName("nsfw")
                .setDescription("(TODO) set if you want nsfw memes, defaults to sfw")),
                interact: async (interaction) => {
                    const embeds = run(interaction);
                    
                    await interaction.reply({embeds, files: [attachment]});
                }
            }
        };
        
        export default command;