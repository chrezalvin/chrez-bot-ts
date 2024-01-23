import { ClientEvents } from "discord.js";
import { EventArguments} from "../";

const event: EventArguments<"ready"> = [
    "ready", 
    (_) => {
        console.log("Bot ready!");
    }
]

export default event;