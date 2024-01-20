import { prefixes } from "@config";
import { CommandReturnTypes} from "@typings/customTypes";
import { CacheType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import {getEventByMonth} from "../../server/services/events";
import { MyEmbedBuilder } from "@modules/basicFunctions";

interface runCommand{
    (message: Message<boolean>, args: string[]): Promise<MyEmbedBuilder[]>;
    (message: ChatInputCommandInteraction<CacheType>): Promise<MyEmbedBuilder[]>;
}

const run: runCommand = async (message, args?: string[]) => {
    const events = await getEventByMonth();

    const embeds = events.eventList.map(event => {
        return new MyEmbedBuilder({
            title: event.name,
            description: event.description
        })
    })

    return embeds;
}

const command: CommandReturnTypes = {
    name: "event",
    alias: ["e", "ev", "events"],
    description: "Check what event is happening this month",
    examples: [
      {command: `${prefixes[0]} event`, description: "Give the list event this month"},
      {command: `${prefixes[0]} event january`, description: "Give the list of events in january"},
  ],
    execute: async (message, args) => {
        const time = new Date();
        // get only the hh:mm:ss format
        const embeds = await run(message, args);
        
        await message.channel.send({embeds});
    },
    slash:{
        slashCommand: new SlashCommandBuilder().setName("event")
            .setDescription("Check what event is happening")
            .addStringOption(opt => 
                opt
                .setName("month")
                .setDescription("month to check")
                .setRequired(false)),

        interact: async (interaction) => {
            const embeds = await run(interaction);
            
            await interaction.reply({embeds});
        }
    }
};

export default command;