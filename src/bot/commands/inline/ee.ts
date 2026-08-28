import {rngInt} from "@library";
import { MessageType } from "discord.js";
import eeData from "@assets/messages/inline/ee.json";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "e.e",
    searchCriteria: ["e.e"],
    description: "sending message to replied e.e message",
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    if(ctx.message.type === MessageType.Reply){
        const repliedMessage = await ctx.message.fetchReference();

        const ee = eeData[rngInt(0, eeData.length - 1)];
        if(repliedMessage.author.id === ctx.message.client.user?.id)
            await ctx.message.reply(ee);
    }

}

export default {inline, middlewares: [execute]} as InlineCommand;