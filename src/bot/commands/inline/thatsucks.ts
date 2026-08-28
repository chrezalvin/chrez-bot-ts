import {rngInt} from "@library";
import { MessageType } from "discord.js";
import thatsucksData from "@assets/messages/inline/thatsucks.json";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "thatsucks",
    searchCriteria: [/^that sucks$/i, /^that's sucks$/i, /^sucks$/i],
    description: "sending message when chrezbot is being replied by a message that contains 'you suck'",
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    if(ctx.message.type === MessageType.Reply){
        const repliedMessage = await ctx.message.fetchReference();

        const thatsucks = thatsucksData[rngInt(0, thatsucksData.length - 1)];
        if(repliedMessage.author.id === ctx.message.client.user?.id)
            await ctx.message.reply(thatsucks);
    }
};

export default {inline, middlewares: [execute]} as InlineCommand;