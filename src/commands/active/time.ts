const debug = require("debug")("ChrezBot:time");

import {MyEmbedBuilder, CommandBuilder} from "@library";

import { SlashCommandBuilder } from "discord.js";
import timeChoices from "@assets/messages/active/timeChoices.json";

import profiles from "@assets/data/profiles.json";

const run = (args?: I_Time) => {
  let timezone: string | null = args?.timezone ?? null;
  
  const time = new Date();
  const embed = new MyEmbedBuilder();

  if(timezone == null){
    debug(`getting japanese time`);

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
    return [embed];
  }
  else{
    debug(`getting ${timezone} time`);
    
    for(const timeChoice of timeChoices){
      if(timeChoice.timezone === timezone || timeChoice.criteria.find(crit => crit.toLowerCase() === timezone?.toLowerCase()) !== undefined){
          const localTime = time.toLocaleString('en-US', {timeZone: timeChoice.timezone, hour12: false, dateStyle: "full", timeStyle: "medium"}).split(' ');
          embed.setTitle(`${timeChoice.name} time`).setDescription(`**${localTime.join(" ")}**`);
          return [embed];
      }
    }

    for(const profile of profiles){
      if(profile.timezone)
        if(profile.name.toLowerCase() === timezone.toLowerCase() || profile.alias.find(ali => ali.toLowerCase() === timezone?.toLowerCase()) !== undefined){
          const localTime = time.toLocaleString('en-US', {timeZone: profile.timezone, hour12: false, dateStyle: "full", timeStyle: "medium"}).split(' ');
          embed.setTitle(`${profile.timezone} time`).setDescription(`**${localTime.join(" ")}**`);
          return [embed];
        }
    }

    throw new Error("timezone not found!");
  }
} 

interface I_Time{
    timezone: string | null;
}

const chreztime = new CommandBuilder<I_Time>()
    .setName("time")
    .setAlias(["t", "chrono"])
    .setDescription("Check japanese time (and how long is it until midnight)")
    .setStatus("public")
    .setMode("available")
    .setSlash({
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
      getParameter: (interaction) => {
        const timezone = interaction.options.getString("timezone", false);

        return {timezone};
      },
      interact: async (interaction, args) => {
        const embeds = run(args);

        interaction.reply({embeds});
      }
    })
    .setChat({
      getParameter: (_, args) => {
        let timezone: string | null = null;

        if(args && args[0] !== undefined)
          timezone = args[0];

        return {timezone};
      },
      execute: async (message, args) => {
        const embeds = run(args);

        message.channel.send({embeds});
      },
    })

export default chreztime;