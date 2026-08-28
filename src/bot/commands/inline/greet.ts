import {rngInt} from "@library";

import greet from "@assets/messages/inline/greet.json";
import { BOT_PREFIXES } from "@config";
import { ChrezBotMiddlewareFunction, ChatContext } from "@library/ChrezBot";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { InlineCommand } from "@commands/types";
import { DiscordUserViewService } from "@services/supabase/services";

const inline = new InlineCommandBuilder({
    name: "greet",
    description: "Greet the user",
    searchCriteria: ["cheese", /^he+re+$/i, ...BOT_PREFIXES],
});

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    // exclusive for vice and owner only!
    const user = await DiscordUserViewService.getDiscordUser(ctx.message.author.id);
    if(user){
        if(user.role === "owner" || user.role === "vice"){
            ctx.message.channel.send(greet.exclusive[rngInt(0, greet.exclusive.length - 1)]
                .replace("[name]", ctx.message.author.username)
                .replace("[role]", user.role)
                .replace("[alias]", user.aliases ? user.aliases[rngInt(0, user.aliases.length - 1)] : "")
            );
            return;
        }
    }

    ctx.message.channel.send(greet.normal[rngInt(0, greet.normal.length - 1)].replace("[name]", ctx.message.author.username));
};

export default {inline, middlewares: [execute]} as InlineCommand;