const debug = require("debug")("ChrezBot:time");

import {MyEmbedBuilder, CommandBuilder, SenddableMessage} from "@library";

import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import timeChoices from "@assets/messages/active/timeChoices.json";

import { UserService } from "@services";
import { User } from "@models";

const run = async (args?: I_Time) => {
  let timezone: string | null = args?.timezone ?? null;
  
  const time = new Date();
  const embed = new MyEmbedBuilder();
  ["- migrated Chrez time to based on database to keep the timezone in sync", "- fixed error on \`Chrez calculate\` where the expression with unit displayed incorrectly"];

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

    try{
      const user = await UserService.findUser(timezone);
      if(user && user.timezone){
        const localTime = time.toLocaleString('en-US', {timeZone: user.timezone, hour12: false, dateStyle: "full", timeStyle: "medium"}).split(' ');
        embed.setTitle(`${user.timezone} time`).setDescription(`**${localTime.join(" ")}**`);
        return [embed];
      }
    }
    catch(e){
      debug(`error finding user: ${e}`);
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
        const embeds = await run(args);

        interaction.reply({embeds});
      }
    })
    .setChat({
      getParameter: (message, args) => {
        let timezone: string | null = null;

        if(args && args[0] !== undefined)
          timezone = args[0];

        return {timezone};
      },
      execute: async (message, args) => {
        let embeds: MyEmbedBuilder[];
        if(args?.timezone === "me"){
          const user = await UserService.getUser(message.author.id);
          embeds = await run({timezone: user.username});
        }
        else
          embeds = await run(args);

        message.channel.send({embeds});
      },
    })

export default chreztime;