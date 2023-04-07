import {CommandReturnTypes} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { prefixes } from "@config";

const cursedDir = path.resolve(__dirname, "../../assets/images/cursed");

const curseds = fs.readdirSync(cursedDir);

const command: CommandReturnTypes = {
    name: "cursed",
    alias: ["curse", "cringe"],
    description: "Sends you a really cursed image",
    examples: [
        {command: `${prefixes[0]} curse`, description: "give random cursed image"},
        {command: `${prefixes[0]} curse 19`, description: "give cursed image #19"}
    ],
    execute: (message, args) => {
        let index = args === undefined ? NaN: parseInt(args[0]);
        let num: number;

        if(!isNaN(index))
        {
          if(index >= 0 && index < curseds.length)
            num = index;
          else 
            throw (`index too many! the index is from ${0} to ${curseds.length - 1}`);
        }
        else num = rngInt(0, curseds.length);

        const attachment = new AttachmentBuilder(`${cursedDir}/${curseds[num]}`, {name: `cursed.jpg`})
        const myEmbed = new MyEmbedBuilder({title: `cursed #${num}`, footer: {text: ""}}).setImage(`attachment://cursed.jpg`);
        
        message.channel.send({embeds: [myEmbed], files: [attachment]});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("cursed")
            .setDescription("Sends you a really cursed image")
            .addIntegerOption(opt => opt
              .setName("index")
              .setDescription("Index to specify which cursed image you want to see")
              .setMinValue(0))
            .addBooleanOption(opt => opt
              .setName("nsfw")
              .setDescription("(TODO) set if you want nsfw image, defaults to sfw")),
        interact: (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");

            const index = interaction.options.getInteger("index", false);
            let num: number;
            if(index === null)
              num = rngInt(0, curseds.length - 1);
            else
              if(index >= curseds.length)
                throw new Error(`Index too many, choose between 0 to ${curseds.length - 1}`);
              else
                num = index;
            
            const attachment = new AttachmentBuilder(`${cursedDir}/${curseds[num]}`, {name: `cursed.jpg`})
            const myEmbed = new MyEmbedBuilder({title: `cursed #${num}`, footer: {text: ""}}).setImage(`attachment://cursed.jpg`);

            interaction.reply({embeds: [myEmbed], files: [attachment]});
        }
    }
};

export default command;