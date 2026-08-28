import {rngInt} from "@library";
import { MessageType } from "discord.js";

import dieMessages from "@assets/messages/inline/die.json";
import { InlineCommandBuilder } from "@library/InlineCommandBuilder";
import { ChatContext, ChrezBotMiddlewareFunction } from "@library/ChrezBot";
import { InlineCommand } from "@commands/types";
import { DiscordUserViewService } from "@services/supabase/services";

const inline = new InlineCommandBuilder({
    name: "die",
    searchCriteria: [/chrez die|die cheese/i, /^die$/i],
    description: "sending mean message to mean people >:(",
})

const execute: ChrezBotMiddlewareFunction<ChatContext> = async (ctx) => {
    const user = await DiscordUserViewService.getDiscordUser(ctx.message.author.id);
    let dieMessage: string  = "";

    if(user && (user.role === "owner" || user.role === "vice"))
        dieMessage = dieMessages[user.role][rngInt(0, dieMessages.owner.length - 1)]
                        .replace("[name]", ctx.message.author.username);
    else
        dieMessage = dieMessages.normal[rngInt(0, dieMessages.normal.length - 1)].replace("[name]", ctx.message.author.username);

    if(ctx.message.type === MessageType.Reply)
        await ctx.message.reply(dieMessage);
    else if(ctx.message.content !== "die")
        await ctx.message.channel.send(dieMessage);
};

export default {inline, middlewares: [execute]} as InlineCommand;