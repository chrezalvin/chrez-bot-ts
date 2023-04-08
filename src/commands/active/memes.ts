import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { prefixes } from "@config";

const memesDir = path.resolve(__dirname, "../../assets/images/meme");

const memes = fs.readdirSync(memesDir);
let attachment: AttachmentBuilder;

const run: runCommand = (message , args?: string[]) => {
  let index: number|null = rngInt(0, memes.length - 1);

  if(isChatInputCommandInteraction(message)){
      let num = message.options.getInteger("index", false);

      if(num !== null)
          index = num;
  }
  else{
      if(args && args[0] !== undefined){
          let num = parseInt(args[0]);
          if(!isNaN(num))
              index = num;
      }
  }

  if(index >= memes.length)
      throw new Error(`index out of bounds, please choose between 0 to ${memes.length - 1}`);
  if(index < 0)
      throw new Error(`index cannot be negative`);

  const meme = memes[index];
  attachment = new AttachmentBuilder(`${memesDir}/${meme}`, {name: `memes.jpg`})
  const embed = new MyEmbedBuilder({title: `memes #${index}`, footer: {text: ""}}).setImage(`attachment://memes.jpg`);

  return embed;
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
      const embed = run(message, args);
      
      await message.channel.send({embeds: [embed], files: [attachment]});
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
            const embed = run(interaction);

            interaction.reply({embeds: [embed], files: [attachment]});
        }
    }
};

export default command;