const debug = require("debug")("ChrezBot:cursed");

import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder, AttachmentBuilder, ChannelType } from "discord.js";
import fs from "fs";
import path from "path";
import { prefixes } from "@config";
// import curseds from "./memes";

const cursedDir = path.resolve("./images/cursed");

const curseds = fs.readdirSync(cursedDir);
let attachment: AttachmentBuilder;

const run: runCommand = (message , args?: string[]) => {
    if(message.channel)
        if(message.channel.type === ChannelType.GuildText)
            if(!message.channel.nsfw)
                throw new Error("I can only send cursed image in age restricted channel");

  let index: number|null = rngInt(0, curseds.length - 1);

  if(isChatInputCommandInteraction(message)){
    let num = message.options.getInteger("index", false);
    debug(`running command /cursed index: ${num ?? "null"}`);

    if(num !== null)
        index = num;

  }
  else{
    debug(`running command ${prefixes[0]} cursed ${args !== undefined ? args.join(' '): ""}`);
      if(args && args[0] !== undefined){
          let num = parseInt(args[0]);
          if(!isNaN(num))
              index = num;
      }
  }

  if(index >= curseds.length)
      throw new Error(`index out of bounds, please choose between 0 to ${curseds.length - 1}`);
  if(index < 0)
      throw new Error(`index cannot be negative`);

  const meme = curseds[index];
  attachment = new AttachmentBuilder(`${cursedDir}/${meme}`, {name: `cursed.jpg`})
  const embed = new MyEmbedBuilder({title: `cursed #${index}`, footer: {text: ""}}).setImage(`attachment://cursed.jpg`);

  return [embed];
}

const command: CommandReturnTypes = {
    name: "cursed",
    alias: ["curse", "cringe"],
    description: "Sends you a really cursed image",
    examples: [
        {command: `${prefixes[0]} curse`, description: "give random cursed image"},
        {command: `${prefixes[0]} curse 19`, description: "give cursed image #19"}
    ],
    execute: async (message, args) => {
        const embeds = run(message, args);
        await message.channel.send({embeds, files: [attachment]});
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
        interact: async (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");
            const embeds = run(interaction);

            await interaction.reply({embeds, files: [attachment]});
        }
    }
};

export default command;