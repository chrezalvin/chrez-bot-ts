import { ClientEvents, version } from "discord.js";
import { EventArguments} from "../";
import { MODE, botVersion } from "@config";
import debug from "debug";

const event: EventArguments<"ready"> = [
    "ready", 
    () => {
        console.log(`Bot ready! running on mode ${MODE}`);
        debug(`discord.js version: ${version}\nbot version: ${botVersion}`);
    }
]

export default event;