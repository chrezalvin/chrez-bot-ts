import {MyEmbedBuilder, rngInt} from "@library/basicFunctions";

import { SlashCommandBuilder, AttachmentBuilder, ChannelType, Message, ChatInputCommandInteraction, CacheType } from "discord.js";
import fs from "fs";
import path from "path";
import { prefixes } from "@config";
import { CommandBuilder } from "@library/CommandBuilder";
import { ErrorValidation } from "@library/ErrorValidation";
// import curseds from "./memes";

const cursedDir = path.resolve("./images/cursed");

const curseds = fs.readdirSync(cursedDir);
let attachment: AttachmentBuilder;

const run = (message: Message<boolean> | ChatInputCommandInteraction<CacheType>, args?: I_Cursed) => {
    if(args === undefined) throw new Error("no argument provided");

    if(message.channel)
        if(message.channel.type === ChannelType.GuildText)
            if(!message.channel.nsfw)
                return new ErrorValidation("command_restricted", "cursed image", "age restricted channel");

  if(args.index >= curseds.length)
    return new ErrorValidation("index_out_of_bounds", 0,  curseds.length - 1);
  if(args.index < 0)
    return new ErrorValidation("index_negative");

  const meme = curseds[args.index];
  attachment = new AttachmentBuilder(`${cursedDir}/${meme}`, {name: `cursed.jpg`})
  const embed = new MyEmbedBuilder({title: `cursed #${args.index}`, footer: {text: ""}}).setImage(`attachment://cursed.jpg`);

  return [embed];
}

// const command: CommandReturnTypes = {
//     name: "cursed",
//     alias: ["curse", "cringe"],
//     description: "Sends you a really cursed image",
//     examples: [
//         {command: `${prefixes[0]} curse`, description: "give random cursed image"},
//         {command: `${prefixes[0]} curse 19`, description: "give cursed image #19"}
//     ],
//     execute: async (message, args) => {
//         const embeds = run(message, args);
//         await message.channel.send({embeds, files: [attachment]});
//     },
//     slash:{
//         slashCommand: new SlashCommandBuilder().setName("cursed")
//             .setDescription("Sends you a really cursed image")
//             .addIntegerOption(opt => opt
//               .setName("index")
//               .setDescription("Index to specify which cursed image you want to see")
//               .setMinValue(0))
//             .addBooleanOption(opt => opt
//               .setName("nsfw")
//               .setDescription("(TODO) set if you want nsfw image, defaults to sfw")),
//         interact: async (interaction) => {
//             const embeds = run(interaction);

//             await interaction.reply({embeds, files: [attachment]});
//         }
//     }
// };

interface I_Cursed{
    index: number;
};

const cursed = new CommandBuilder<I_Cursed>({
    name: "cursed",
    alias: ["curse", "cringe"],
    description: "Sends you a really cursed image",
    examples: [
        {command: `${prefixes[0]} curse`, description: "give random cursed image"},
        {command: `${prefixes[0]} curse 19`, description: "give cursed image #19"}
    ],
    slash: {
        slashCommand: new SlashCommandBuilder().setName("cursed")
            .setDescription("Sends you a really cursed image")
            .addIntegerOption(opt => opt
              .setName("index")
              .setDescription("Index to specify which cursed image you want to see")
              .setMinValue(0)),
        interact: async (interaction, args) => {
            const embeds = run(interaction, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await interaction.reply({embeds, files: [attachment]});
        },
        getParameter(interaction) {
            const index = interaction.options.getInteger("index", false) ?? rngInt(0, curseds.length - 1);

            return {index};
        }
    },
    chat: {
        execute: async (message, args) => {
            const embeds = run(message, args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;

            await message.channel.send({embeds, files: [attachment]});
        },
        getParameter(_, args) {
            let index = rngInt(0, curseds.length - 1);

            if(args.length != 0){
                let num = parseInt(args[0]);
                if(!isNaN(num))
                    index = num;
            }

            return {index};
        }
    },
    status: "public",
});

export default cursed;