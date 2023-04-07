import interactionCreate from "./interactionCreate";
import messageCreate from "./messageCreate";

export default {
    eventName: "on" as const,
    events: [interactionCreate, messageCreate]
};