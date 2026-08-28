import {rngInt} from "@library";
import yayData from "@assets/data/yays.json";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "yay",
    description: "yays whenever users says yay",
    searchCriteria: [/^y(a|e)*y/i, /^yeeee+s/i],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    ctx.message.channel.send(yayData.yays[rngInt(0, yayData.yays.length - 1)]);
};

export default {inline, middlewares: [execute]} as InlineCommand;