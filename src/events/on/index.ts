import { ClientEvents } from "discord.js";
import { EventArguments, EventReturnType} from "../";

import interactionCreate from "./interactionCreate";
import messageCreate from "./messageCreate";
import error from "./error";

const executeList = [
    interactionCreate,
    messageCreate,
    error,
] as EventArguments<keyof ClientEvents>[];

const once: EventReturnType = {
    name: "on",
    execute: executeList,
}

export default once;