import {MyEmbedBuilder, rngInt} from "@library";

import pewpew from "@assets/messages/inline/pewpew.json";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";

const inline = new InlineCommandBuilder({
    name: "pewpew",
    description: "Give pewpew",
    searchCriteria: ["pewpew", "pew", "pew pew", "mamekwpqnseueurbdudlalzmaa"],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const embed = new MyEmbedBuilder()
        .setTitle(pewpew[rngInt(0, pewpew.length - 1)]);
    ctx.message.channel.send({embeds: [embed]});
};

export default {inline, middlewares: [execute]} as InlineCommand;