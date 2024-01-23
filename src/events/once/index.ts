import { ClientEvents } from "discord.js";
import { EventArguments, EventReturnType} from "../";
import ready from "./ready";

const executeList = [
    ready
] as EventArguments<keyof ClientEvents>[];

const once: EventReturnType = {
    name: "once",
    execute: executeList,
}

export default once;