import {CommandReturnTypes} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { prefixes } from "@config";

const memesDir = path.resolve(__dirname, "../../assets/images/meme");

const memes = fs.readdirSync(memesDir);

const command: CommandReturnTypes = {
    name: "meme",
    alias: ["memes"],
    description: "Sends you a meme",
    examples: [
      {command: `${prefixes[0]} meme`, description: "give random meme"},
      {command: `${prefixes[0]} meme 19`, description: "give meme #19"}
  ],
    execute: (message, args) => {

        let index = args === undefined ? NaN: parseInt(args[0]);
        let num: number;

        if(!isNaN(index))
        {
          if(index >= 0 && index < memes.length)
            num = index;
          else 
            throw (`index too many! the index is from ${0} to ${memes.length - 1}`);
        }
        else num = rngInt(0, memes.length);

        const attachment = new AttachmentBuilder(`${memesDir}/${memes[num]}`, {name: `memes.jpg`})
        const myEmbed = new MyEmbedBuilder({title: `memes #${num}`, footer: {text: ""}}).setImage(`attachment://memes.jpg`);
        
        message.channel.send({embeds: [myEmbed], files: [attachment]});
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
        interact: (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");

            const index = interaction.options.getInteger("index", false);
            let num: number;
            if(index === null)
              num = rngInt(0, memes.length - 1);
            else
              if(index >= memes.length)
                throw new Error(`Index too many, choose between 0 to ${memes.length - 1}`);
              else
                num = index;
            
            const attachment = new AttachmentBuilder(`${memesDir}/${memes[num]}`, {name: `memes.jpg`})
            const myEmbed = new MyEmbedBuilder({title: `memes #${num}`, footer: {text: ""}}).setImage(`attachment://memes.jpg`);

            interaction.reply({embeds: [myEmbed], files: [attachment]});
        }
    }
};

export default command;