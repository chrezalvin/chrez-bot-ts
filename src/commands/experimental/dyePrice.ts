// const debug = require("debug")("ChrezBot:cursed");

// import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "library/customTypes";
// import {MyEmbedBuilder, rngInt} from "@library/basicFunctions";

// import { SlashCommandBuilder, AttachmentBuilder, ChannelType, Attachment } from "discord.js";
// import fs from "fs";
// import path from "path";
// import { prefixes } from "@config";
// import * as PImage from "pureimage";

// function toBuffer(arrayBuffer: ArrayBuffer) {
//     const buffer = Buffer.alloc(arrayBuffer.byteLength);
//     const view = new Uint8Array(arrayBuffer);
//     for (let i = 0; i < buffer.length; ++i) {
//       buffer[i] = view[i];
//     }
//     return buffer;
//   }

// // import curseds from "./memes";

// const cursedDir = path.resolve("./images/cursed");

// const curseds = fs.readdirSync(cursedDir);
// let attachment: AttachmentBuilder;

// const run: runCommand = (message , args?: string[]) => {

//   if(isChatInputCommandInteraction(message)){

//   }
//   else{
//     debug(`running command ${prefixes[0]} cursed ${args !== undefined ? args.join(' '): ""}`);
//   }

//   const img = PImage.make(20, 20, {});
//   const ctx = img.getContext("2d");
//   ctx.fillStyle = '#FF00FF';
//   ctx.fillRect(0, 0, 20, 20);
  
//   PImage.encodePNGToStream(img, fs.createWriteStream('./images/out.png')).then(() => {
//     console.log("wrote out the png file to out.png");
//   }).catch((e)=>{
//     console.log("there was an error writing");
//   });

//   attachment = new AttachmentBuilder("./images/out.png", {name: `color.png`})
//   const embed = new MyEmbedBuilder({title: `color`, footer: {text: ""}}).setImage(`attachment://color.png`);

//   return [embed];
// }

// async function getAttachmentImage(){
//     const outPath = './images/out.png';
//     const img = PImage.make(20, 20, {});
//     const ctx = img.getContext("2d");
//     ctx.fillStyle = '#FF00FF';
//     ctx.fillRect(0, 0, 20, 20);
    
//     await PImage.encodePNGToStream(img, fs.createWriteStream(outPath));
//     return outPath;
// }

// const command: CommandReturnTypes = {
//     name: "dyePrice",
//     alias: [],
//     description: "Sends you a really cursed image",
//     examples: [],
//     execute: async (message, args) => {
      
//         const myattachment = new AttachmentBuilder(await getAttachmentImage(), {name: `color.png`});
//         const embed = new MyEmbedBuilder({title: `color`, footer: {text: ""}}).setImage(`attachment://color.png`);
//         const embeds = [embed];

//         await message.channel.send({embeds, files: [myattachment]});
//     },
//     slash:{
//         slashCommand: new SlashCommandBuilder().setName("dyeprice")
//             .setDescription("Sends you a really cursed image")
//             .addStringOption(opt => {
//                 const equipments = ["additional", "shield", "armor", "knuckle", "halberd", "ohs", "ths"]
//                 opt.setName("Equipment");
//                 opt.setDescription("Equipment to choose");
//                 opt.setRequired(true);
//                 for(const eq of equipments)
//                     opt.addChoices({name: eq, value: eq});
                
//                 return opt;
//             })
//             .addIntegerOption(opt => opt
//               .setName("A")
//               .setDescription("Color number for part A (1 - 84)")
//               .setMinValue(1)
//               .setMaxValue(84)
//               )
//             .addIntegerOption(opt => opt
//               .setName("B")
//               .setDescription("Color number for part B (1 - 84)")
//               .setMinValue(1)
//               .setMaxValue(84)
//               )
//             .addIntegerOption(opt => opt
//               .setName("C")
//               .setDescription("Color number for part C (1 - 84)")
//               .setMinValue(1)
//               .setMaxValue(84)
//               ),
//         interact: async (interaction) => {
//             const embeds = run(interaction);

//             await interaction.reply({embeds, files: [attachment]});
//         }
//     }
// };

// export default command;