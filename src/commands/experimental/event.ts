import { prefixes } from "@config";
import { CommandReturnTypes} from "library/customTypes";
import { CacheType, ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import {getEventByMonth} from "../../services/events";
import { MyEmbedBuilder } from "@library/basicFunctions";
import { CommandBuilder } from "@library/CommandBuilder";

const run = async (args?: I_Event) => {
    const events = await getEventByMonth();

    const embeds = events.eventList.map(event => {
        return new MyEmbedBuilder({
            title: event.name,
            description: event.description
        })
    })

    return embeds;
}

interface I_Event{

}

const chrezEvent = new CommandBuilder<I_Event>()
    .setName("event")
    .setAlias(["e", "ev", "events"])
    .setDescription("Check what event is happening this month")
    .setMode("unavailable")
    .setExamples([
        {
            command: "Chrez event",
            description: "Give the list event this month"
        },
        {
            command: "Chrez event january",
            description: "Give the list of events in january"
        }
    ])
    .setSlash({
        interact: async (interaction, args) => {
            const embeds = await run(args);
            
            await interaction.reply({embeds});
        }
    })
    .setChat({
        execute: async (message, args) => {
            const embeds = await run(args);
            
            await message.channel.send({embeds});
        }
    })

export default chrezEvent;