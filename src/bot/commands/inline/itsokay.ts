import {rngInt} from "@library";
import itsokays from "@assets/messages/inline/itsokay.json";
import { MessageType } from "discord.js";
import { CLIENT_ID } from "@config";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "itsok",
    description: "Says random message whenever user reply chrezbot with sorry",
    searchCriteria: [/sorry/gi],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    // will be removed as soon acceptable length is implemented
    if(ctx.message.content.length > 10) return;

    // check if reply
    if(ctx.message.type !== MessageType.Reply) return;

    const messageReplied = await ctx.message.fetchReference();
    if(
        messageReplied.author.bot 
        && 
        messageReplied.author.id === CLIENT_ID 
        && 
        messageReplied.content.match(/yell/i)
        &&
        messageReplied.createdAt.getTime() > Date.now() - 1000 * 60 * 5
    ){
        ctx.message.reply({
            allowedMentions: { repliedUser: false },
            content: itsokays[rngInt(0, itsokays.length - 1)],
        });
    }
};

export default {inline, middlewares: [execute]} as InlineCommand;