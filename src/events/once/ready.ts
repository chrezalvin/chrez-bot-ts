import { Events, version } from "discord.js";
import { EventArguments} from "../";
import { MODE, BOT_VERSION } from "@config";
import debug from "debug";

const event: EventArguments<Events.ClientReady> = [
    Events.ClientReady, 
    () => {
        console.log(`Bot ready! running on mode ${MODE}`);
        debug(`discord.js version: ${version}\nbot version: ${BOT_VERSION}`);
    }
]

export default event;