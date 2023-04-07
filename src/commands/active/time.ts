import {CommandReturnTypes} from "@typings/customTypes";
import {MyEmbedBuilder, rngInt} from "../../modules/basicFunctions";

import { SlashCommandBuilder } from "discord.js";
import timeChoices from "@assets/messages/active/timeChoices.json";
import { prefixes } from "@config";

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
        const embed = new MyEmbedBuilder();

        if(args === undefined || args.length === 0){
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
                if(timeChoice.criteria.find(crit => crit === args[0]) !== undefined){
                    const localTime = time.toLocaleString('en-US', {timeZone: timeChoice.timezone, hour12: false, dateStyle: "full", timeStyle: "medium"}).split(' ');
                    embed.setTitle(`${timeChoice.name} time`).setDescription(`**${localTime.join(" ")}**`);
                    await message.channel.send({embeds: [embed]});
                    return;
                }
            }

            throw new Error("timezone not found!");
        }
        
        message.channel.send({embeds: [embed]});
    
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("time")
            .setDescription("Check japanese time (and how long is it until midnight)")
            .addStringOption(opt => {
                opt.setName("timezone").setDescription("(optional) Timezone to check");
                for(const timeChoice of timeChoices)
                    opt.addChoices({name: timeChoice.name, value: timeChoice.timezone})
                return opt;
            }),

        interact: async (interaction) => {
            if(!interaction.isChatInputCommand())
                throw new Error("Bot can't reply the interaction received");

            const time = new Date();
            const timezone = interaction.options.getString("timezone", false);
            const embed = new MyEmbedBuilder();
            
            if(timezone == null){
                // get only the hh:mm:ss format
                const japTime = time.toLocaleString('en-US', {timeZone: "Japan"}).split(' ')[1];
                
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
                    if(timeChoice.timezone === timezone){
                        const localTime = time.toLocaleString('en-US', {timeZone: timeChoice.timezone, hour12: false, dateStyle: "full", timeStyle: "medium"}).split(' ');
                        embed.setTitle(`${timeChoice.name} time`).setDescription(`**${localTime.join(" ")}**`);
                        await interaction.reply({embeds: [embed]});
                        return;
                    }
                }
    
                throw new Error("timezone not found!");
            }
            
            interaction.reply({embeds: [embed]});
        }
    }
};

export default command;