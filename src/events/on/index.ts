import { ClientEvents } from "discord.js";
import { EventArguments, EventReturnType} from "../";

import interactionCreate from "./interactionCreate";

const executeList = [
    interactionCreate
] as EventArguments<keyof ClientEvents>[];

const once: EventReturnType = {
    name: "on",
    execute: executeList,
}

export default once;