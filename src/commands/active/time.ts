const debug = require("debug")("ChrezBot:story");

import {CommandReturnTypes, isChatInputCommandInteraction, runCommand} from "@typings/customTypes";
import {MyEmbedBuilder} from "../../modules/basicFunctions";

import { SlashCommandBuilder, time } from "discord.js";
import timeChoices from "@assets/messages/active/timeChoices.json";
import { prefixes } from "@config";

import profiles from "@assets/data/profiles.json";

const run: runCommand = (message , args?: string[]) => {
  let timezone: string | null = null;
  const time = new Date();
  const embed = new MyEmbedBuilder();

  if(isChatInputCommandInteraction(message)){
    const timezone_hold = message.options.getString("timezone", false);

    debug(`running command /time timezone: ${timezone_hold ?? "null"}`);

    if(timezone_hold !== null)
      timezone = timezone_hold;
  }
  else{
    debug(`running command ${prefixes[0]} time ${args !== undefined ? args.join(' '): ""}`);
    if(args && args[0] !== undefined)
      timezone = args[0];
  }

  if(timezone === null){
    const japTime = time.toLocaleString('en-US', {timeZone: "Japan", hour12: false}).split(' ')[1];

    // calculate time left
    const timeLeft = {
      hour: 24 - (time.getUTCHours() + 10) % 24,
      minute: 60 - time.getUTCMinutes()};
    
    let myText;
    if(timeLeft.minute == 0)
      myText = `${time.getHours()} hours left`;
    else if (timeLeft.hour == 0)
      myText = `${timeLeft.minute} minutes left`;
    else if(timeLeft.hour == 0 && timeLeft.minute == 0)
      myText = `It's midnight`;
    else
      myText = `${timeLeft.hour} hours and ${timeLeft.minute} minutes left`;

    embed.setTitle(`it's ${japTime} Japanese time`).setFooter({text: `${myText} until midnight`});
  }
  else{
    for(const timeChoice of timeChoices){
      if(timeChoice.timezone === timezone || timeChoice.criteria.find(crit => crit === timezone) !== undefined){
          const localTime = time.toLocaleString('en-US', {timeZone: timeChoice.timezone, hour12: false, dateStyle: "full", timeStyle: "medium"}).split(' ');
          embed.setTitle(`${timeChoice.name} time`).setDescription(`**${localTime.join(" ")}**`);
          return [embed];
      }
    }

    for(const profile of profiles){
      if(profile.timezone)
        if(profile.timezone === timezone || profile.alias.find(ali => ali === timezone) !== undefined){
          const localTime = time.toLocaleString('en-US', {timeZone: profile.timezone, hour12: false, dateStyle: "full", timeStyle: "medium"}).split(' ');
          embed.setTitle(`${profile.timezone} time`).setDescription(`**${localTime.join(" ")}**`);
          return [embed];
        }
    }

    throw new Error("timezone not found!");
  }
  return [embed];
} 

const command: CommandReturnTypes = {
    name: "time",
    alias: ["t", "chrono"],
    description: "Check japanese time (and how long is it until midnight)",
    examples: [
      {command: `${prefixes[0]} time`, description: "give current japan time (and time until midnight)"},
      {command: `${prefixes[0]} time india`, description: "give india time (kolkata)"},
      {command: `${prefixes[0]} time indo`, description: "give Indonesian time (Jakarta)"},
  ],
    execute: async (message, args) => {
        const time = new Date();
        // get only the hh:mm:ss format
        const embeds = run(message, args);
        
        await message.channel.send({embeds});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("time")
            .setDescription("Check japanese time (and how long is it until midnight)")
            .addStringOption(opt => {
                opt.setName("timezone").setDescription("Timezone to check");
                for(const timeChoice of timeChoices){
                    if(timeChoice.memberRef)
                      opt.addChoices({name: `(${timeChoice.memberRef}) ${timeChoice.name}`, value: timeChoice.timezone})
                    else
                      opt.addChoices({name: timeChoice.name, value: timeChoice.timezone})
                }
                return opt;
            }),

        interact: async (interaction) => {
            const embeds = run(interaction);
            
            await interaction.reply({embeds});
        }
    }
};

export default command;