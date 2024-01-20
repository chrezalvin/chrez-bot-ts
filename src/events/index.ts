// import on from "./on";
// import once from "./once";
// import { Awaitable, ClientEvents } from "discord.js";

// export const discordEventKeys = createEnum({
//     applicationCommandPermissionsUpdate: "applicationCommandPermissionsUpdate",
//     autoModerationActionExecution: "autoModerationActionExecution",
//     autoModerationRuleCreate: "autoModerationRuleCreate",
//     autoModerationRuleDelete: "autoModerationRuleDelete",
//     autoModerationRuleUpdate: "autoModerationRuleUpdate",
//     inviteCreate: "inviteCreate",
//     inviteDelete: "inviteDelete",
//     messageCreate: "messageCreate",
//     messageDelete: "messageDelete",
//     messageReactionRemoveAll: "messageReactionRemoveAll",
//     interactionCreate: "interactionCreate"
// })

// type DiscordEventKeys = keyof typeof discordEventKeys;

// interface EventReturnType{
//     name: DiscordEventKeys;
//     execute: (...args: [DiscordEventKeys]) => Awaitable<void>;
// }

// function createEnum<T extends { [P in keyof T]: P }>(o: T) {
//     return o
// }

// export const botEvents: Record<"on" | "once", EventReturnType[]> = {
//     on: on.events,
//     once: once.events
// }