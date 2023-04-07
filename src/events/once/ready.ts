import { EventReturnType } from "@typings/customTypes";
import { Events, version } from "discord.js";

const event: EventReturnType<Events.ClientReady> = {
    name: Events.ClientReady,
    execute: (client) => {
        console.log(`Bot ready! Running on Discord ${version}`);
    }
}

export default event;