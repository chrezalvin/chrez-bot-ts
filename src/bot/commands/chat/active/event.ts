import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { ChatCommandBuilder } from "@library/ChatCommandBuilder";
import { event, I_Event } from "@services/discord/event";
import { ChatCommand } from "@commands/types";

const chat = new ChatCommandBuilder({
    name: "event",
    alias: ["e", "ev", "events"],
    description: "Check what event is happening this month",
    examples: [
        {
            command: "Chrez event",
            description: "Give the list event this month"
        },
        {
            command: "Chrez event upcoming",
            description: "Give the list of upcoming event (next month)"
        },
        {
            command: "Chrez event january",
            description: "Give the list of events in january"
        },
        {
            command: "Chrez event 1",
            description: "Give the list of events in january"
        },
        {
            command: "Chrez event valentine",
            description: "Give valentine event description"
        },
        {
            command: "Chrez event ongoing",
            description: "Give the list of ongoing event"
        },
        {
            command: "Chrez event incoming",
            description: "Give the list of incoming event"
        }
    ]
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const arg = ctx.args[0];
    let tag: I_Event["tag"];

    switch(arg){
        case "ongoing":
        case "incoming":
            tag = arg;
            break;
        default:
            tag = "annual";
    }

    const embeds = await event({
        str: ctx.args[0],
        tag
    });  

    await ctx.message.channel.send(embeds);
}

export default {chat, middlewares: [execute]} as ChatCommand;