import { EventReturnType } from "@typings/customTypes";
import { Client, ClientEvents, Events, InteractionType } from "discord.js";

const event: EventReturnType<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    execute(interaction) {
        if(interaction.isChatInputCommand())
            console.log(`accepted interaction by ${interaction.commandName}`);
    }
}

export default event;