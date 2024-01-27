import {EventArguments} from "../"

import { Events } from "discord.js";

const event: EventArguments<Events.Error> = [
    Events.Error,
    (errorMessages) => {
        console.log(`Fatal error: ${errorMessages.name} - ${errorMessages.message}`);
    }
]

export default event;