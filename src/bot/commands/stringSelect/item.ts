import { StringSelectCommand } from "@bot/commands/types";
import { ChrezBotMiddlewareFunction, SlashContext } from "@library/ChrezBot";
import { ItemService } from "@services/discord";

const customId = "item";

const execute: ChrezBotMiddlewareFunction<SlashContext> = async (ctx) => {
    const itemId = ctx.stringSelectMenuInteraction.values[0];
   
    const res = await ItemService.item({itemId});

    await ctx.stringSelectMenuInteraction.reply(res);
}

export default {customId, middlewares: [execute]} as StringSelectCommand;