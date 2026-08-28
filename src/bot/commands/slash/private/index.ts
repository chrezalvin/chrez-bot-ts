import { SlashCommand } from "@commands/types";
import bulkDelete from "./bulkDelete";
import setmute from "./setmute";
import unmute from "./unmute";
import why from "./why";

export const commands = [
    bulkDelete,
    setmute,
    unmute,
    why,
] as SlashCommand[];